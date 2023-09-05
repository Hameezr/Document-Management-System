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
        let specificFileType = mimetype?.split("/")[1] || '';
        const ownerId = '2305b6f2-7b41-4b77-82c0-db507d49e06a';

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
                metadata = this.validateAndParseMetadata(req.body.metadata, fileType, author);
            } else {
                const dynamicAttributes = await this.extractDynamicMetadata(fileType, specificFileType, req.file.buffer);
                metadata = MetadataSchema.createFromAttributes(fileType, dynamicAttributes, author);
            }
        } catch (e) {
            if (e instanceof Error) {
                return AppResult.Err(AppError.InvalidData(e.message));
            } else {
                return AppResult.Err(AppError.InvalidData('An unknown error occurred'));
            }
        }

        const validationResult = NewDocumentDto.getSchema().safeParse({
            title,
            ownerId,
            file: {
                fileName: originalname || '',
                fileExtension: originalname?.split(".").pop() || "",
                contentType: mimetype || '',
                tags: tagsArray,
                metadata
            },
        });

        if (!validationResult.success) {
            const detailedErrors = validationResult.error.errors.map(issue => {
                const humanReadablePath = issue.path.join('.');
                const pathArray = issue.path;
                if (pathArray[0] === 'file' && pathArray[1] === 'tags' || 'name' && pathArray[3]) {
                    const index = pathArray[2];
                    const fieldName = pathArray[3];
                    if (issue.message === "Required") {
                        return `The '${fieldName}' field is required in the tags object at index ${index}.`;
                    } else if (issue.message.includes("String must contain")) {
                        return `The '${fieldName}' field should not be empty in the tags object at index ${index}.`;
                    }
                }
                return `${humanReadablePath} -> ${issue.message}`;
            }).join(', ');
            return AppResult.Err(AppError.InvalidData(detailedErrors));
        }

        const newDocumentDtoValidationResult = NewDocumentDto.create(validationResult.data);
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

    private validateAndParseMetadata(metadata: string, fileType: string, author: string): MetadataSchema {
        const parsedMetadata = JSON.parse(metadata);
        const metadataSchema = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes, author);
        metadataSchema.validateAttributes();
        if (metadataSchema.type !== fileType) {
            throw new Error('Metadata type does not match the file type');
        }
        return metadataSchema;
    }

    private async extractDynamicMetadata(fileType: string, specificFileType: string, fileBuffer: Buffer): Promise<Record<string, string | number>> {
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
            if (specificFileType === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
                dynamicAttributes = {
                    pages: 'N/A for docx'
                };
            } else if (specificFileType === 'vnd.ms-excel') {
                dynamicAttributes = {
                    sheets: 4
                };
            } else if (specificFileType === 'vnd.ms-powerpoint') {
                dynamicAttributes = {
                    pages: 'N/A for ppt',
                }
            } else {
                const data = await pdf(fileBuffer);
                dynamicAttributes = {
                    pages: data.numpages,
                    version: data.info.PDFFormatVersion
                };
            }
        }
        return dynamicAttributes;
    }
}