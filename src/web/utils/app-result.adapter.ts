import { Response } from 'express';

import {
    AppResult,
    AppErrStatus,
    DtoValidationError,
    AppError
} from '@carbonteq/hexapp';

export class HttpResponse {
    static sendFromAppResult<T>(result: AppResult<T>, res: Response): void {
        if (result.isOk()) {
            res.send(result.unwrap());
            return;
        }

        const err = (result as AppResult<T>).unwrapErr();
        const errorMessage = err.message;

        switch (err.status) {
            case AppErrStatus.Unauthorized:
                throw AppError.Unauthorized(errorMessage);
            case AppErrStatus.InvalidData:
                throw AppError.InvalidData(errorMessage);
            case AppErrStatus.AlreadyExists:
                throw AppError.AlreadyExists(errorMessage);
            case AppErrStatus.NotFound:
                throw AppError.NotFound(errorMessage);
            case AppErrStatus.InvalidOperation:
                throw AppError.InvalidOperation(errorMessage);
            case AppErrStatus.ExternalServiceFailure:
                throw AppError.ExternalServiceFailure(errorMessage);
            default:
                console.log("sendFromAppResult default case");
                throw AppError.Generic("An unknown error occurred");
        }
    }

    static fromError(err: unknown): AppError | DtoValidationError {
        let actualError: any;
    
        // Check if the error is an instance of AppResult
        if (err instanceof AppResult && !err.isOk()) {
            actualError = (err as AppResult<any>).unwrapErr();
        } else {
            actualError = err;
        }
        // Check the type of the actual error
        if (actualError instanceof DtoValidationError) {
            const DtoError = new DtoValidationError(actualError.message);
            return DtoError;
        }
        return AppError.fromErr(actualError as Error);
    }
}
