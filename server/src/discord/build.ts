import { ClientImpl, DiscordTokenProvider } from "./adapters/structures";
import { AddReactionEventProvider, MessageCommandEventProvider, SlashCommandEventProvider } from "./adapters/events";
import { ErrorAction, HelpAction, ProfileAction, RequestAction, UserAction } from "./actions";
import {
  ErrorMessageGeneratorImpl,
  ProfileMessageGeneratorImpl,
  RequestMessageGeneratorImpl,
  UserMessageGeneratorImpl,
  HelpMessageGeneratorImpl
} from "./views";
import { AddReactionActionRouter, MessageCommandActionRouter, SlashCommandActionRouter } from "./routers";
import { ProfileEndpoint, RequestEndpoint, UserEndpoint } from "../app";
import { AuthEndpoint } from "../auth";

type Endpoints = {
  profile: ProfileEndpoint;
  request: RequestEndpoint;
  user: UserEndpoint;
  auth: AuthEndpoint;
};

export class DiscordBuilder {
  private readonly client: ClientImpl;

  public constructor(private readonly tokenProvider: DiscordTokenProvider, private readonly endpoints: Endpoints) {
    this.client = new ClientImpl(this.tokenProvider);
    this.buildModules();
  }

  private buildModules() {
    const events = {
      addReaction: new AddReactionEventProvider(this.client),
      slashCommand: new SlashCommandEventProvider(this.client),
      messageCommand: new MessageCommandEventProvider(this.client)
    };

    const messages = {
      profile: new ProfileMessageGeneratorImpl(),
      request: new RequestMessageGeneratorImpl(),
      user: new UserMessageGeneratorImpl(),
      help: new HelpMessageGeneratorImpl(),
      error: new ErrorMessageGeneratorImpl()
    };

    const errorAction = new ErrorAction(messages.error);
    const actions = {
      profile: new ProfileAction(this.endpoints.auth, this.endpoints.profile, messages.profile, errorAction),
      request: new RequestAction(this.endpoints.auth, this.endpoints.request, messages.request, errorAction),
      user: new UserAction(this.endpoints.auth, this.endpoints.user, messages.user, errorAction),
      help: new HelpAction(messages.help)
    };

    new AddReactionActionRouter(events.addReaction, actions).register();
    new SlashCommandActionRouter(events.slashCommand, actions).register();
    new MessageCommandActionRouter(events.messageCommand, actions).register();
  }

  public initialize() {
    void this.client.initialize();
  }
}
