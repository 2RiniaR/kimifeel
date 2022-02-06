import { MessageEmbed } from "discord.js";
import {
  ClientUserNotExistError,
  ContentLengthLimitError,
  ProfileNotFoundError,
  RequestNotFoundError,
  SendRequestOwnError,
  UnavailableError,
  UserAlreadyRegisteredError,
  UserNotFoundError
} from "app/endpoints/errors";
import {
  ErrorEmbed,
  ProfileContentLengthLimitEmbed,
  ProfileNotFoundEmbed,
  RequestNotFoundEmbed,
  SendRequestOwnEmbed,
  UserAlreadyRegisteredEmbed,
  UserNotFoundEmbed,
  UserRegisterRequiredEmbed,
  CommandUnexpectedArgumentEmbed,
  CommandUnexpectedOptionEmbed,
  ParameterFormatInvalidEmbed,
  UnavailableEmbed
} from "discord/views";
import { UnexpectedArgumentError, UnknownOptionsError } from "../../command-parser/interpret/label";
import { InvalidFormatError } from "../../command-parser/interpret/converter";
import { ArgumentFormatInvalidError } from "./errors";

export function getErrorEmbed(error: unknown): MessageEmbed {
  if (error instanceof ClientUserNotExistError) {
    return new UserRegisterRequiredEmbed();
  }
  if (error instanceof ProfileNotFoundError) {
    return new ProfileNotFoundEmbed(error.identifier);
  }
  if (error instanceof UserNotFoundError) {
    return new UserNotFoundEmbed(error.identifier);
  }
  if (error instanceof RequestNotFoundError) {
    return new RequestNotFoundEmbed(error.specifier);
  }
  if (error instanceof ContentLengthLimitError) {
    return new ProfileContentLengthLimitEmbed(error.min, error.max, error.actual);
  }
  if (error instanceof SendRequestOwnError) {
    return new SendRequestOwnEmbed();
  }
  if (error instanceof UserAlreadyRegisteredError) {
    return new UserAlreadyRegisteredEmbed(error.identifier);
  }
  if (error instanceof UnexpectedArgumentError) {
    return new CommandUnexpectedArgumentEmbed(error.expected, error.actual);
  }
  if (error instanceof UnknownOptionsError) {
    return new CommandUnexpectedOptionEmbed(error.optionsName);
  }
  if (error instanceof InvalidFormatError) {
    return new ParameterFormatInvalidEmbed(error.parameter.name, error.parameter.convertType.name);
  }
  if (error instanceof ArgumentFormatInvalidError) {
    return new ParameterFormatInvalidEmbed(error.position, error.format);
  }
  if (error instanceof UnavailableError) {
    return new UnavailableEmbed();
  }

  return new ErrorEmbed(error);
}
