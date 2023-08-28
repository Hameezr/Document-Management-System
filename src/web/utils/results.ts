import { Response } from "express";
import { AppResult } from "@carbonteq/hexapp";

export async function handleResult<T>(
  res: Response,
  result: AppResult<T>,
  successStatus: number
): Promise<void> {
  if (result.isOk()) {
    res.status(successStatus).json(result.unwrap());
  } else {
    throw (result as AppResult<T>).unwrapErr();
  }
}
