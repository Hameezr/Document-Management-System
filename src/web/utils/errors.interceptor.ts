import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "./app-result.adapter";
import { AppErrStatus, DtoValidationError } from "@carbonteq/hexapp";

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
                res.status(422).send({ message: transformedError.message });
            } else {
                const httpStatusCode = mapAppErrStatusToHttpCode(transformedError.status);
                res.status(httpStatusCode).send({ message: transformedError.message });
            }
        } catch (error) {
            res.status(500).send({ message: "An unknown error occurred" });
        }
    };
}