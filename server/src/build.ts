import { ProfileController, RequestController, UserController } from "controllers";
import { ProfileEndpoint, RequestEndpoint, UserEndpoint } from "endpoints";
import { InteractionEventRunner, MessageEventRunner, ReactionEventRunner } from "discord/events";
import { InteractionRouter, MessageRouter, ReactionRouter } from "discord/actions";
import { ClientManager } from "./discord/client";
import { SettingsManager } from "./settings";

const settings = new SettingsManager();

const controllers = {
  profile: new ProfileController(),
  request: new RequestController(),
  user: new UserController()
} as const;

const endpoints = {
  profile: new ProfileEndpoint(controllers.profile),
  request: new RequestEndpoint(controllers.request),
  user: new UserEndpoint(controllers.user)
} as const;

const client = new ClientManager(settings);

const events = {
  reaction: new ReactionEventRunner(client),
  interaction: new InteractionEventRunner(client),
  message: new MessageEventRunner(client)
} as const;

const actions = {
  reaction: new ReactionRouter(events.reaction, endpoints),
  interaction: new InteractionRouter(events.interaction, endpoints),
  message: new MessageRouter(events.message, endpoints)
};

Object.values(actions).forEach((action) => action.registerActions());

settings.load();
void client.initialize();
