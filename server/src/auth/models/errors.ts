import { ConnectionError } from "../../prisma";

export class NotFoundError extends Error {}
export class DataAccessFailedError extends Error {}
export class DiscordIdFormatError extends Error {}
export class UserAlreadyRegisteredError extends Error {}

export function withHandleRepositoryErrors<TReturn>(inner: () => TReturn) {
  try {
    return inner();
  } catch (error) {
    if (error instanceof ConnectionError) throw new DataAccessFailedError();
    throw error;
  }
}
