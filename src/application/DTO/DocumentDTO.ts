export interface DocumentDTO {
  id: string;
  title: string;
  file: {
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: { key: string; name: string }[];
  };
  author: string;
  createdAt: Date;
  updatedAt: Date;
  // Add other properties for document metadata, categories, etc.
}
