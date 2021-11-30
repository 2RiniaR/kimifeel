import { DeleteProfileController } from "controllers/delete-profile-controller";
import { AddProfileController } from "controllers/add-profile-controller";
import { ShowProfilesController } from "controllers/show-profiles-controller";
import { CancelRequestController } from "controllers/cancel-request-controller";
import { SubmitRequestController } from "controllers/submit-request-controller";
import { AcceptRequestController } from "controllers/accept-request-controller";
import { DenyRequestController } from "controllers/deny-request-controller";
import {
  AcceptRequestAction,
  AddProfileAction,
  CancelRequestAction,
  DeleteProfileAction,
  DenyRequestAction,
  ShowProfilesAction,
  SubmitRequestAction
} from "discord/actions";

new AcceptRequestAction().register(new AcceptRequestController());
new AddProfileAction().register(new AddProfileController());
new CancelRequestAction().register(new CancelRequestController());
new DeleteProfileAction().register(new DeleteProfileController());
new DenyRequestAction().register(new DenyRequestController());
new ShowProfilesAction().register(new ShowProfilesController());
new SubmitRequestAction().register(new SubmitRequestController());
