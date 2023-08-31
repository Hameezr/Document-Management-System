import { Request } from "express";
import { AppError, AppResult } from '@carbonteq/hexapp';
import { MetadataSchema } from "../../domain/valueObjects/MetadataVO";
import { NewDocumentDto } from "../DTO/DocumentDTO";
import sharp from 'sharp';
import { parseBuffer } from 'music-metadata';
import pdf from 'pdf-parse';
import { injectable } from "inversify";

@injectable()
export class ProcessFileService {
    async processFile(req: Request): Promise<AppResult<NewDocumentDto>> {
        const { title, author } = req.body;
        const { originalname, mimetype } = req.file || {};
        const fileType = mimetype?.split("/")[0] || '';

        if (!req.file) {
            return AppResult.Err(AppError.InvalidData("No file provided"));
        }

        let tagsArray;
        try {
            tagsArray = this.validateAndParseTags(req.body.tags);
        } catch (e) {
            if (e instanceof Error) {
                return AppResult.Err(AppError.InvalidData(e.message));
            } else {
                return AppResult.Err(AppError.InvalidData('An unknown error occurred'));
            }
        }


        let metadata: MetadataSchema;
        try {
            if (req.body.metadata) {
                metadata = this.validateAndParseMetadata(req.body.metadata, fileType);
            } else {
                const dynamicAttributes = await this.extractDynamicMetadata(fileType, req.file.buffer);
                metadata = MetadataSchema.createFromAttributes(fileType, dynamicAttributes);
            }
        } catch (e) {
            if (e instanceof Error) {
                return AppResult.Err(AppError.InvalidData(e.message));
            } else {
                return AppResult.Err(AppError.InvalidData('An unknown error occurred'));
            }
        }


        const newDocumentDtoValidationResult = NewDocumentDto.create({
            title,
            file: {
                fileName: originalname || '',
                fileExtension: originalname?.split(".").pop() || "",
                contentType: mimetype || '',
                tags: tagsArray,
                metadata
            },
            author
        });

        if (newDocumentDtoValidationResult.isErr()) {
            const validationError = newDocumentDtoValidationResult.unwrapErr();
            return AppResult.Err(AppError.InvalidData(validationError.message));
        }
        return AppResult.Ok(newDocumentDtoValidationResult.unwrap());
    }

    private validateAndParseTags(tags: string): any[] {
        let tagsArray: any = [];
        try {
            if (tags) {
                tagsArray = JSON.parse(tags);
            }
        } catch (e) {
            throw new Error("Invalid tags format");
        }
        return tagsArray;
    }

    private validateAndParseMetadata(metadata: string, fileType: string): MetadataSchema {
        const parsedMetadata = JSON.parse(metadata);
        const metadataSchema = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes);
        metadataSchema.validateAttributes();
        if (metadataSchema.type !== fileType) {
            throw new Error('Metadata type does not match the file type');
        }
        return metadataSchema;
    }

    private async extractDynamicMetadata(fileType: string, fileBuffer: Buffer): Promise<Record<string, string | number>> {
        let dynamicAttributes = {};

        // Image metadata extraction
        if (fileType === 'image') {
            const imageMetadata = await sharp(fileBuffer).metadata();
            dynamicAttributes = {
                resolution: `${imageMetadata.width}x${imageMetadata.height}`,
                colorDepth: `${imageMetadata.channels} channels`,
                format: imageMetadata.format
            };
        }

        // Audio metadata extraction
        if (fileType === 'audio') {
            const audioMetadata = await parseBuffer(fileBuffer, 'audio/mpeg');
            dynamicAttributes = {
                duration: audioMetadata.format.duration,
                bitrate: audioMetadata.format.bitrate,
                channels: audioMetadata.format.numberOfChannels
            };
        }

        // PDF metadata extraction
        if (fileType === 'application') {
            const data = await pdf(fileBuffer);
            dynamicAttributes = {
                pages: data.numpages,
                version: data.info.PDFFormatVersion
            };
        }
        return dynamicAttributes;
    }
}