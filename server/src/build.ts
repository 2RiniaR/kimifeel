import {
  AcceptRequestEndpoint,
  CancelRequestEndpoint,
  CreateRequestEndpoint,
  DeleteProfileEndpoint,
  DenyRequestEndpoint,
  GetProfilesEndpoint,
  GetRequestsEndpoint
} from "./endpoints";
import {
  AcceptRequestController,
  CancelRequestController,
  CreateRequestController,
  DeleteProfileController,
  DenyRequestController,
  GetProfilesController,
  GetRequestsController
} from "./controllers";
import { MessageCommandEvent, ReactionAddEvent, SlashCommandEvent } from "./discord/events";
import {
  MessageCommandAcceptRequestAction,
  MessageCommandCancelRequestAction,
  MessageCommandDeleteProfileAction,
  MessageCommandDenyRequestAction,
  MessageCommandSendRequestAction,
  MessageCommandShowProfilesAction,
  MessageCommandShowRequestsAction,
  ReactionAcceptRequestAction,
  ReactionCancelRequestAction,
  ReactionDenyRequestAction,
  SlashCommandAcceptRequestAction,
  SlashCommandCancelRequestAction,
  SlashCommandDeleteProfileAction,
  SlashCommandDenyRequestAction,
  SlashCommandSendRequestAction,
  SlashCommandShowProfilesAction
} from "./discord/actions";
import { SlashCommandShowRequestsAction } from "./discord/actions/slash-command/show-requests";

export function buildApplication(): unknown[] {
  const endpoints = {
    acceptRequest: new AcceptRequestEndpoint(),
    cancelRequest: new CancelRequestEndpoint(),
    denyRequest: new DenyRequestEndpoint(),
    createRequest: new CreateRequestEndpoint(),
    deleteProfile: new DeleteProfileEndpoint(),
    getProfiles: new GetProfilesEndpoint(),
    getRequests: new GetRequestsEndpoint()
  } as const;

  const controllers = {
    acceptRequest: new AcceptRequestController(),
    cancelRequest: new CancelRequestController(),
    denyRequest: new DenyRequestController(),
    createRequest: new CreateRequestController(),
    deleteProfile: new DeleteProfileController(),
    getProfiles: new GetProfilesController(),
    getRequests: new GetRequestsController()
  } as const;

  endpoints.acceptRequest.listen(controllers.acceptRequest);
  endpoints.cancelRequest.listen(controllers.cancelRequest);
  endpoints.denyRequest.listen(controllers.denyRequest);
  endpoints.createRequest.listen(controllers.createRequest);
  endpoints.deleteProfile.listen(controllers.deleteProfile);
  endpoints.getProfiles.listen(controllers.getProfiles);
  endpoints.getRequests.listen(controllers.getRequests);

  const events = {
    reactionAdd: new ReactionAddEvent(),
    slashCommand: new SlashCommandEvent(),
    messageCommand: new MessageCommandEvent()
  } as const;

  new MessageCommandAcceptRequestAction(endpoints.acceptRequest, events.messageCommand);
  new MessageCommandCancelRequestAction(endpoints.cancelRequest, events.messageCommand);
  new MessageCommandDeleteProfileAction(endpoints.deleteProfile, events.messageCommand);
  new MessageCommandDenyRequestAction(endpoints.denyRequest, events.messageCommand);
  new MessageCommandSendRequestAction(endpoints.createRequest, events.messageCommand);
  new MessageCommandShowProfilesAction(endpoints.getProfiles, events.messageCommand);
  new MessageCommandShowRequestsAction(endpoints.getRequests, events.messageCommand);

  new ReactionAcceptRequestAction(endpoints.acceptRequest, events.reactionAdd);
  new ReactionCancelRequestAction(endpoints.cancelRequest, events.reactionAdd);
  new ReactionDenyRequestAction(endpoints.denyRequest, events.reactionAdd);

  new SlashCommandAcceptRequestAction(endpoints.acceptRequest, events.slashCommand);
  new SlashCommandCancelRequestAction(endpoints.cancelRequest, events.slashCommand);
  new SlashCommandDeleteProfileAction(endpoints.deleteProfile, events.slashCommand);
  new SlashCommandDenyRequestAction(endpoints.denyRequest, events.slashCommand);
  new SlashCommandSendRequestAction(endpoints.createRequest, events.slashCommand);
  new SlashCommandShowProfilesAction(endpoints.getProfiles, events.slashCommand);
  new SlashCommandShowRequestsAction(endpoints.getRequests, events.slashCommand);

  Object.values(events).forEach((event) => event.activate());
  return [endpoints, events];
}
