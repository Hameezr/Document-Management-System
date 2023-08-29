export class MetadataSchema {
    private readonly _type: "audio" | "video" | "application" | "image";
    private readonly _attributes: string[];

    constructor(type: "audio" | "video" | "application" | "image", attributes: any) {
        this._type = type;
        this._attributes = attributes;
    }

    get type(): "audio" | "video" | "application" | "image" {
        return this._type;
    }

    get attributes(): string[] {
        return this._attributes;
    }

    equals(other: MetadataSchema): boolean {
        return this._type === other._type && this.arraysEqual(this._attributes, other._attributes);
    }

    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    validateAttributes() {
        const requiredAttributes = getRequiredAttributesForType(this._type);
        const attributeKeys = this._attributes.map(attr => attr.split(':')[0]); // Extract keys from 'key:value' strings
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


    static createFromAttributes(type: string, attributes?: any): MetadataSchema {
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
        return new MetadataSchema(type as any, finalAttributes);
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
