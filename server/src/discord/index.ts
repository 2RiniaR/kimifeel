import { ClientManager } from "./client";
import { TargetGuildManager } from "./target-guild";
import { ReactionAddEvent, SlashCommandEvent } from "./events";
import {
  ChangeRequestEndpoint,
  CreateRequestEndpoint,
  DeleteProfileEndpoint,
  GetProfilesEndpoint,
  GetRequestsEndpoint
} from "./endpoints";

export const clientManager = new ClientManager();
export const targetGuildManager = new TargetGuildManager(clientManager.client);

const events = {
  reactionAdd: new ReactionAddEvent(),
  slashCommand: new SlashCommandEvent()
} as const;
Object.values(events).forEach((event) => event.activate());

export const endpoints = {
  changeRequest: new ChangeRequestEndpoint(),
  createRequest: new CreateRequestEndpoint(),
  deleteProfile: new DeleteProfileEndpoint(),
  getProfiles: new GetProfilesEndpoint(),
  getRequests: new GetRequestsEndpoint()
} as const;
