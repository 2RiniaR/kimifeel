import { MessageEmbed } from "discord.js";
import {
  ClientUserNotExistError,
  ContentLengthLimitError,
  ProfileNotFoundError,
  RequestNotFoundError,
  SendRequestOwnError,
  UserAlreadyRegisteredError,
  UserNotFoundError
} from "endpoints/errors";
import {
  ErrorEmbed,
  ProfileContentLengthLimitEmbed,
  ProfileNotFoundEmbed,
  RequestNotFoundEmbed,
  SendRequestOwnEmbed,
  UserAlreadyRegisteredEmbed,
  UserNotFoundEmbed,
  UserRegisterRequiredEmbed
} from "discord/views";

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
    return new RequestNotFoundEmbed(error.identifier);
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

  return new ErrorEmbed(error);
}
