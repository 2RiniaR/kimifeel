import { DeleteProfileController } from "controllers/delete-profile-controller";
import { GetProfilesController } from "controllers/get-profiles-controller";
import { CancelRequestController } from "controllers/cancel-request-controller";
import { CreateRequestController } from "controllers/create-request-controller";
import { ChangeRequestController } from "controllers/change-request-controller";
import { DenyRequestController } from "controllers/deny-request-controller";
import {
  ReactionChangeRequestAction,
  CancelRequestAction,
  SlashCommandDeleteProfileAction,
  DenyRequestAction,
  SlashCommandShowProfilesAction,
  CommandSendRequestAction
} from "discord/actions";

new ReactionChangeRequestAction().listen(new ChangeRequestController());
new CancelRequestAction().listen(new CancelRequestController());
new SlashCommandDeleteProfileAction().listen(new DeleteProfileController());
new DenyRequestAction().listen(new DenyRequestController());
new SlashCommandShowProfilesAction().listen(new GetProfilesController());
new CommandSendRequestAction().listen(new CreateRequestController());
