import { DeleteProfileController } from "controllers/delete-profile-controller";
import { GetProfilesController } from "controllers/get-profiles-controller";
import { CancelRequestController } from "controllers/cancel-request-controller";
import { CreateRequestController } from "controllers/create-request-controller";
import { ChangeRequestController } from "controllers/change-request-controller";
import { DenyRequestController } from "controllers/deny-request-controller";
import {
  ReactionChangeRequestAction,
  CancelRequestAction,
  DeleteProfileAction,
  DenyRequestAction,
  ShowProfilesAction,
  SubmitRequestAction
} from "discord/actions";

new ReactionChangeRequestAction().listen(new ChangeRequestController());
new CancelRequestAction().listen(new CancelRequestController());
new DeleteProfileAction().listen(new DeleteProfileController());
new DenyRequestAction().listen(new DenyRequestController());
new ShowProfilesAction().listen(new GetProfilesController());
new SubmitRequestAction().listen(new CreateRequestController());
