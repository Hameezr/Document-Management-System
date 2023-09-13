import { Response } from "express";
import { AppResult } from "@carbonteq/hexapp";
import AppLogger from "../../infrastructure/logger/logger";

export async function handleResult<T>(
  res: Response,
  result: AppResult<T>,
  successStatus: number,
  logger?: AppLogger,
  successMessage: string = "Operation successful"
): Promise<void> {
  if (result.isOk()) {
    const data = result.unwrap();
    if (data !== undefined) {
      logger?.info('status: ', successStatus, successMessage)
      res.status(successStatus).json(data);
    } else {
      logger?.info('status: ', successStatus, 'Message:', successMessage)
      res.status(successStatus).json({ message: successMessage });
    }
  } else {
    throw (result as AppResult<T>).unwrapErr();
  }
}
