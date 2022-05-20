import {HttpError} from "./errors";

export function validateResponseOk(response: Response): void {
  if (!response.ok) {
    throw new HttpError(response.status);
  }
}
