import { UnexpectedArgumentError, UnknownOptionsError } from "../../command-parser/interpret/label";
import { InvalidFormatError } from "../../command-parser/interpret/converter";
import {
  CommandUnexpectedArgumentMessage,
  CommandUnexpectedOptionMessage,
  ErrorMessage,
  ParameterFormatInvalidMessage,
  ProfileContentLengthLimitMessage,
  ProfileNotFoundMessage,
  RequestNotFoundMessage,
  SendRequestOwnMessage,
  UnavailableMessage,
  UserNotFoundMessage,
  UserRegisterRequiredMessage
} from "../views";
import {
  ClientUserNotExistError,
  ContentLengthLimitError,
  ProfileNotFoundError,
  RequestNotFoundError,
  SendRequestOwnError,
  UnavailableError,
  UserNotFoundError
} from "../../app/endpoints/errors";
import { SystemMessage } from "../structures";

export class ActionError extends Error {}

export class ArgumentFormatInvalidError extends ActionError {
  readonly position: string;
  readonly format: string;

  constructor(position: string, format: string) {
    super();
    this.position = position;
    this.format = format;
  }
}

export function getErrorMessage(error: unknown): SystemMessage {
  if (error instanceof ClientUserNotExistError) {
    return new UserRegisterRequiredMessage();
  }
  if (error instanceof ProfileNotFoundError) {
    return new ProfileNotFoundMessage(error.specifier);
  }
  if (error instanceof UserNotFoundError) {
    return new UserNotFoundMessage(error.specifier);
  }
  if (error instanceof RequestNotFoundError) {
    return new RequestNotFoundMessage(error.specifier);
  }
  if (error instanceof ContentLengthLimitError) {
    return new ProfileContentLengthLimitMessage(error.min, error.max, error.actual);
  }
  if (error instanceof SendRequestOwnError) {
    return new SendRequestOwnMessage();
  }
  if (error instanceof UnexpectedArgumentError) {
    return new CommandUnexpectedArgumentMessage(error.expected, error.actual);
  }
  if (error instanceof UnknownOptionsError) {
    return new CommandUnexpectedOptionMessage(error.optionsName);
  }
  if (error instanceof InvalidFormatError) {
    return new ParameterFormatInvalidMessage(error.parameter.name, error.parameter.convertType.name);
  }
  if (error instanceof ArgumentFormatInvalidError) {
    return new ParameterFormatInvalidMessage(error.position, error.format);
  }
  if (error instanceof UnavailableError) {
    return new UnavailableMessage();
  }

  return new ErrorMessage(error);
}
