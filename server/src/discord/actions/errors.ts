import * as Auth from "auth";
import * as App from "app";
import { emptyErrorPipeline, ErrorGuardEndAsync } from "helpers/catch";
import { Communicator } from "./communicator";
import {
  CommandArgumentUnexpectedError,
  CommandOptionUnexpectedError,
  CommandParseFailedError,
  DiscordUserIdentity,
  InvalidFormatError,
  ProfileContentLengthLimitError,
  ProfileIdentity,
  ProfileNotFoundError,
  ReadMessageFailedError,
  RequestIdentity,
  RequestNotFoundError,
  SentRequestOwnError,
  SystemMessage,
  UnavailableError,
  UserAlreadyRegisteredError,
  UserNotFoundError,
  UserNotRegisteredError
} from "../structures";

export const withConvertAppErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof App.ClientUserNotExistError) throw new UserNotRegisteredError();
  if (error instanceof App.ProfileNotFoundError)
    throw new ProfileNotFoundError(error.specifier.index !== undefined ? { index: error.specifier.index } : undefined);
  if (error instanceof App.UserNotFoundError)
    throw new UserNotFoundError(
      error.specifier.discordId !== undefined ? { id: error.specifier.discordId } : undefined
    );
  if (error instanceof App.RequestNotFoundError)
    throw new RequestNotFoundError(error.specifier.index !== undefined ? { index: error.specifier.index } : undefined);
  if (error instanceof App.SentRequestOwnError) throw new SentRequestOwnError();
  if (error instanceof App.ContentLengthLimitError)
    throw new ProfileContentLengthLimitError(error.min, error.max, error.actual);
  if (error instanceof App.UnavailableError) throw new UnavailableError();
  if (error instanceof App.ParameterFormatInvalidError)
    throw new InvalidFormatError(error.key.toString(), error.format);
});

export const withConvertAuthErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof Auth.UserAlreadyRegisteredError)
    throw new UserAlreadyRegisteredError({ id: error.specifier.discordId });
  if (error instanceof Auth.UnavailableError) throw new UnavailableError();
  if (error instanceof Auth.UserNotFoundError) throw new UserNotRegisteredError();
});

export interface ErrorMessageGenerator {
  userRegisterRequired(): SystemMessage;
  profileNotFound(profile?: ProfileIdentity): SystemMessage;
  requestNotFound(request?: RequestIdentity): SystemMessage;
  userNotFound(user?: DiscordUserIdentity): SystemMessage;
  userAlreadyRegistered(user: DiscordUserIdentity): SystemMessage;
  contentLengthLimited(min: number, max: number, actual: number): SystemMessage;
  sentRequestOwn(): SystemMessage;
  commandArgumentUnexpected(expected: number, actual: number): SystemMessage;
  commandOptionUnexpected(names: readonly string[]): SystemMessage;
  commandParseFailed(): SystemMessage;
  invalidFormat(position: string, format: string): SystemMessage;
  unavailable(): SystemMessage;
  unknown(error: unknown): SystemMessage;
}

export class ErrorAction {
  public constructor(private readonly messageGenerator: ErrorMessageGenerator) {}

  public withErrorResponses(communicator: Communicator): ErrorGuardEndAsync<void> {
    return emptyErrorPipeline.guardAndReturnAsync(async (error) => {
      const replyMessage = this.getErrorMessage(error);
      if (replyMessage === undefined) return;
      await communicator.reply(replyMessage, { showOnlySender: true, showOnlyActive: true });
    });
  }

  private getErrorMessage(error: unknown): SystemMessage | undefined {
    if (error instanceof UserNotRegisteredError) return this.messageGenerator.userRegisterRequired();
    if (error instanceof ProfileNotFoundError) return this.messageGenerator.profileNotFound(error.profile);
    if (error instanceof UserNotFoundError) return this.messageGenerator.userNotFound(error.user);
    if (error instanceof RequestNotFoundError) return this.messageGenerator.requestNotFound(error.request);
    if (error instanceof ProfileContentLengthLimitError)
      return this.messageGenerator.contentLengthLimited(error.min, error.max, error.actual);
    if (error instanceof SentRequestOwnError) return this.messageGenerator.sentRequestOwn();
    if (error instanceof UnavailableError) return this.messageGenerator.unavailable();
    if (error instanceof InvalidFormatError) return this.messageGenerator.invalidFormat(error.position, error.format);
    if (error instanceof UserAlreadyRegisteredError) return this.messageGenerator.userAlreadyRegistered(error.user);
    if (error instanceof CommandArgumentUnexpectedError)
      return this.messageGenerator.commandArgumentUnexpected(error.expected, error.actual);
    if (error instanceof CommandOptionUnexpectedError)
      return this.messageGenerator.commandOptionUnexpected(error.names);
    if (error instanceof CommandParseFailedError) return this.messageGenerator.commandParseFailed();
    if (error instanceof ReadMessageFailedError) return undefined;

    return this.messageGenerator.unknown(error);
  }
}
