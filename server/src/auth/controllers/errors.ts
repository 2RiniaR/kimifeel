import { DataAccessFailedError } from "../models/errors";
import { UnavailableError } from "../endpoints/errors";

export function withHandleModelErrors<TReturn>(inner: () => TReturn) {
  try {
    return inner();
  } catch (error) {
    if (error instanceof DataAccessFailedError) throw new UnavailableError();
    throw error;
  }
}
