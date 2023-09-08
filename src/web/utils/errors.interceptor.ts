import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "./app-result.adapter";
import { AppErrStatus, DtoValidationError } from "@carbonteq/hexapp";
import AppLogger from "../../infrastructure/logger/logger";

const logger = new AppLogger();
logger.setContext('ErrorsInterceptor');

function mapAppErrStatusToHttpCode(status: string): number {
    switch (status) {
        case AppErrStatus.Unauthorized:
            return 401;
        case AppErrStatus.InvalidData:
            return 400;
        case AppErrStatus.AlreadyExists:
            return 409;
        case AppErrStatus.NotFound:
            return 404;
        case AppErrStatus.InvalidOperation:
            return 403;
        case AppErrStatus.ExternalServiceFailure:
            return 502;
        default:
            return 500;
    }
}

export function errorsInterceptorMiddleware() {
    return async function (
        err: unknown,
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const transformedError = HttpResponse.fromError(err);
            if (transformedError instanceof DtoValidationError) {
                logger.error(`Validation error: ${transformedError.message}`);
                res.status(422).send({ message: transformedError.message });
            } else {
                const httpStatusCode = mapAppErrStatusToHttpCode(transformedError.status);
                logger.error(`Error occurred with status ${httpStatusCode}: ${transformedError.message}`);
                res.status(httpStatusCode).send({ message: transformedError.message });
            }
        } catch (error) {
            logger.error("An unknown error occurred", error);
            res.status(500).send({ message: "An unknown error occurred" });
        }
    };
}