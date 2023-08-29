import { Response } from "express";
import { AppResult } from "@carbonteq/hexapp";

export async function handleResult<T>(
  res: Response,
  result: AppResult<T>,
  successStatus: number,
  successMessage: string = "Operation successful"
): Promise<void> {
  if (result.isOk()) {
    const data = result.unwrap();
    if (data !== undefined) {
      res.status(successStatus).json(data);
    } else {
      res.status(successStatus).json({ message: successMessage });
    }
  } else {
    throw (result as AppResult<T>).unwrapErr();
  }
}
