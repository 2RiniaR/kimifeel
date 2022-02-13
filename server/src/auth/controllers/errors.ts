import { DataAccessFailedError } from "auth/models";
import * as Endpoint from "auth/endpoints";
import { emptyErrorPipeline } from "helpers/catch";

export const withConvertModelErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof DataAccessFailedError) throw new Endpoint.UnavailableError();
});
