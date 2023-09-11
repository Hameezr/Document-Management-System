import fs from 'fs';
import { IFileService } from '../../../domain/shared/interfaces/IFile';
import { injectable } from "inversify";

@injectable()
export class FileUtility implements IFileService {
    readFile(path: string): Promise<string> {
        return fs.promises.readFile(path, 'utf-8');
    }

    writeFile(path: string, data: string): Promise<void> {
        return fs.promises.writeFile(path, data);
    }

    fileExists(path: string): boolean {
        return fs.existsSync(path);
    }
}
