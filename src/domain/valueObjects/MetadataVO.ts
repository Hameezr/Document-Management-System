import { DocumentType } from "../shared/type.utils";

export class MetadataSchema {
    private readonly _type: DocumentType;
    private readonly _author: string;
    private readonly _attributes: Record<string, any>;

    constructor(type: DocumentType, author: string, attributes: any) {
        this._type = type;
        this._author = author;
        this._attributes = attributes;
    }

    get type(): DocumentType {
        return this._type;
    }

    get author(): string {
        return this._author;
    }

    get attributes(): Record<string, any> {
        return this._attributes;
    }

    validateAttributes() {
        const requiredAttributes = getRequiredAttributesForType(this._type);
        const attributeKeys = Object.keys(this._attributes);
        const missingAttributes = [];
        for (const required of requiredAttributes) {
            if (!attributeKeys.includes(required)) {
                missingAttributes.push(required);
            }
        }

        if (missingAttributes.length > 0) {
            throw new Error(`Missing required attributes for type ${this._type}: ${missingAttributes.join(', ')}`);
        }
    }


    static createFromAttributes(type: string, author: string, attributes?: any): MetadataSchema {
        // Validate the type or throw an error
        if (!["audio", "video", "application", "image"].includes(type)) {
            throw new Error("Invalid metadata type provided.");
        }

        // Default attributes based on type
        let defaultAttributes: any = {};
        switch (type) {
            case "audio":
                defaultAttributes = {
                    duration: null,
                    bitrate: null,
                    channels: null
                };
                break;
            case "video":
                defaultAttributes = {
                    resolution: null,
                    fps: null,
                    duration: null
                };
                break;
            case "application":
                defaultAttributes = {
                    version: null,
                    pages: null
                };
                break;
            case "image":
                defaultAttributes = {
                    resolution: null,
                    colorDepth: null,
                    format: null
                };
                break;
        }

        // If attributes are provided, use them; if not, use defaultAttributes
        const finalAttributes = attributes || defaultAttributes;
        return new MetadataSchema(type as any, author, finalAttributes);
    }
}

// Helper function to get required attributes based on file type
function getRequiredAttributesForType(type: string): string[] {
    switch (type) {
        case 'audio':
            return ['duration', 'bitrate', 'channels'];
        case 'image':
            return ['resolution', 'colorDepth', 'format'];
        case 'application':
            return ['pages', 'version'];
        case 'video':
            return ['resolution', 'fps', 'duration'];
        default:
            return [];
    }
}
