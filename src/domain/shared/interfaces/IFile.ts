export interface IFileService {
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    fileExists(path: string): boolean;
}