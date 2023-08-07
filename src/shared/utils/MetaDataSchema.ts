export const AudioMetadataSchema = {
    // Define your audio metadata attributes here
    duration: "string",
    artist: "string",
  };

  // Schema for video metadata
  export const VideoMetadataSchema = {
    // Define your video metadata attributes here
    duration: "string",
    resolution: "string",
  };

  // Schema for document metadata
  export const DocumentMetadataSchema = {
    // Define your document metadata attributes here
    pageCount: "number",
    format: "string",
  };

  // Schema for image metadata
  export const ImageMetadataSchema = {
    // Define your image metadata attributes here
    resolution: "string",
    photographer: "string",
  };