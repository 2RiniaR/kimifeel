import { ConnectionError } from "data-store";
import { emptyErrorPipeline } from "helpers/catch";

export class NotFoundError extends Error {}
export class DataAccessFailedError extends Error {}
export class DiscordIdFormatError extends Error {}
export class UserAlreadyRegisteredError extends Error {}

export const withConvertRepositoryErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof ConnectionError) throw new DataAccessFailedError();
});
