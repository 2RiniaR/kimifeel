import {
  DeleteProfileEndpoint,
  FindProfileEndpoint,
  RandomProfilesEndpoint,
  SearchProfilesEndpoint,
  AcceptRequestEndpoint,
  CancelRequestEndpoint,
  CreateRequestEndpoint,
  DenyRequestEndpoint,
  FindRequestEndpoint,
  SearchRequestsEndpoint,
  RegisterUserEndpoint,
  UnregisterUserEndpoint
} from "./endpoints";

import {
  DeleteProfileRunner,
  FindProfileRunner,
  RandomProfilesRunner,
  SearchProfilesRunner,
  AcceptRequestRunner,
  CancelRequestRunner,
  CreateRequestRunner,
  DenyRequestRunner,
  FindRequestRunner,
  SearchRequestsRunner,
  RegisterUserRunner,
  UnregisterUserRunner
} from "./controllers";

import { MessageCommandEvent, ReactionAddEvent, SlashCommandEvent } from "./discord/events";

import {
  MessageCommandDeleteProfileAction,
  MessageCommandRandomProfilesAction,
  MessageCommandSearchProfilesAction,
  MessageCommandShowProfileAction,
  MessageCommandAcceptRequestAction,
  MessageCommandCancelRequestAction,
  MessageCommandDenyRequestAction,
  MessageCommandSearchRequestsAction,
  MessageCommandSendRequestAction,
  MessageCommandShowRequestAction,
  MessageCommandRegisterUserAction,
  ReactionAcceptRequestAction,
  ReactionCancelRequestAction,
  ReactionDenyRequestAction,
  SlashCommandDeleteProfileAction,
  SlashCommandRandomProfilesAction,
  SlashCommandSearchProfilesAction,
  SlashCommandShowProfileAction,
  SlashCommandAcceptRequestAction,
  SlashCommandCancelRequestAction,
  SlashCommandDenyRequestAction,
  SlashCommandSearchRequestsAction,
  SlashCommandSendRequestAction,
  SlashCommandShowRequestAction,
  SlashCommandRegisterUserAction
} from "./discord/actions";

const endpoints = {
  deleteProfile: new DeleteProfileEndpoint(),
  findProfile: new FindProfileEndpoint(),
  randomProfiles: new RandomProfilesEndpoint(),
  searchProfiles: new SearchProfilesEndpoint(),
  acceptRequest: new AcceptRequestEndpoint(),
  cancelRequest: new CancelRequestEndpoint(),
  createRequest: new CreateRequestEndpoint(),
  denyRequest: new DenyRequestEndpoint(),
  findRequest: new FindRequestEndpoint(),
  searchRequests: new SearchRequestsEndpoint(),
  registerUser: new RegisterUserEndpoint(),
  unregisterUser: new UnregisterUserEndpoint()
} as const;

const controllers = {
  deleteProfile: new DeleteProfileRunner(),
  findProfile: new FindProfileRunner(),
  randomProfiles: new RandomProfilesRunner(),
  searchProfiles: new SearchProfilesRunner(),
  acceptRequest: new AcceptRequestRunner(),
  cancelRequest: new CancelRequestRunner(),
  createRequest: new CreateRequestRunner(),
  denyRequest: new DenyRequestRunner(),
  findRequest: new FindRequestRunner(),
  searchRequests: new SearchRequestsRunner(),
  registerUser: new RegisterUserRunner(),
  unregisterUser: new UnregisterUserRunner()
} as const;

endpoints.deleteProfile.listen(controllers.deleteProfile);
endpoints.findProfile.listen(controllers.findProfile);
endpoints.randomProfiles.listen(controllers.randomProfiles);
endpoints.searchProfiles.listen(controllers.searchProfiles);
endpoints.acceptRequest.listen(controllers.acceptRequest);
endpoints.cancelRequest.listen(controllers.cancelRequest);
endpoints.createRequest.listen(controllers.createRequest);
endpoints.denyRequest.listen(controllers.denyRequest);
endpoints.findRequest.listen(controllers.findRequest);
endpoints.searchRequests.listen(controllers.searchRequests);
endpoints.registerUser.listen(controllers.registerUser);
endpoints.unregisterUser.listen(controllers.unregisterUser);

const events = {
  reactionAdd: new ReactionAddEvent(),
  slashCommand: new SlashCommandEvent(),
  messageCommand: new MessageCommandEvent()
} as const;

new MessageCommandDeleteProfileAction(endpoints.deleteProfile, events.messageCommand).activate();
new MessageCommandRandomProfilesAction(endpoints.randomProfiles, events.messageCommand).activate();
new MessageCommandSearchProfilesAction(endpoints.searchProfiles, events.messageCommand).activate();
new MessageCommandShowProfileAction(endpoints.findProfile, events.messageCommand).activate();
new MessageCommandAcceptRequestAction(endpoints.acceptRequest, events.messageCommand).activate();
new MessageCommandCancelRequestAction(endpoints.cancelRequest, events.messageCommand).activate();
new MessageCommandDenyRequestAction(endpoints.denyRequest, events.messageCommand).activate();
new MessageCommandSearchRequestsAction(endpoints.searchRequests, events.messageCommand).activate();
new MessageCommandSendRequestAction(endpoints.createRequest, events.messageCommand).activate();
new MessageCommandShowRequestAction(endpoints.findRequest, events.messageCommand).activate();
new MessageCommandRegisterUserAction(endpoints.registerUser, events.messageCommand).activate();
new ReactionAcceptRequestAction(endpoints.acceptRequest, events.reactionAdd).activate();
new ReactionCancelRequestAction(endpoints.cancelRequest, events.reactionAdd).activate();
new ReactionDenyRequestAction(endpoints.denyRequest, events.reactionAdd).activate();
new SlashCommandDeleteProfileAction(endpoints.deleteProfile, events.slashCommand).activate();
new SlashCommandRandomProfilesAction(endpoints.randomProfiles, events.slashCommand).activate();
new SlashCommandSearchProfilesAction(endpoints.searchProfiles, events.slashCommand).activate();
new SlashCommandShowProfileAction(endpoints.findProfile, events.slashCommand).activate();
new SlashCommandAcceptRequestAction(endpoints.acceptRequest, events.slashCommand).activate();
new SlashCommandCancelRequestAction(endpoints.cancelRequest, events.slashCommand).activate();
new SlashCommandDenyRequestAction(endpoints.denyRequest, events.slashCommand).activate();
new SlashCommandSearchRequestsAction(endpoints.searchRequests, events.slashCommand).activate();
new SlashCommandSendRequestAction(endpoints.createRequest, events.slashCommand).activate();
new SlashCommandShowRequestAction(endpoints.findRequest, events.slashCommand).activate();
new SlashCommandRegisterUserAction(endpoints.registerUser, events.slashCommand).activate();

Object.values(events).forEach((event) => event.activate());
