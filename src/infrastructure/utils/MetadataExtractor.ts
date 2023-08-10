import sharp from 'sharp';
// Will add other libraries for audio etc

class MetadataExtractor {
    
    static async extractImageMetadata(fileBuffer: Buffer): Promise<any> {
        const metadata = await sharp(fileBuffer).metadata();
        // Process and return the metadata as needed
        const dynamicAttributes = {
            resolution: `${metadata.width}x${metadata.height}`,
            colorDepth: `${metadata.channels} channels`,
            format: metadata.format
          };
        return {
            dynamicAttributes
        };
    }
    
    /*
    static async extractVideoMetadata(filePath: string): Promise<any> {
        // Implement using `fluent-ffmpeg` or similar libraries
        // Return relevant metadata for videos
    }
    */
}

export default MetadataExtractor;
