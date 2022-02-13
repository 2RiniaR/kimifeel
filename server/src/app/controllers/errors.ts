import { DataAccessFailedError } from "app/models";
import * as Endpoint from "app/endpoints";
import { emptyErrorPipeline } from "helpers/catch";

export const withConvertModelErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof DataAccessFailedError) throw new Endpoint.UnavailableError();
});
