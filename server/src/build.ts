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

new AcceptRequestEndpoint().listen(new AcceptRequestController());
new CancelRequestEndpoint().listen(new CancelRequestController());
new DenyRequestEndpoint().listen(new DenyRequestController());
new CreateRequestEndpoint().listen(new CreateRequestController());
new DeleteProfileEndpoint().listen(new DeleteProfileController());
new GetProfilesEndpoint().listen(new GetProfilesController());
new GetRequestsEndpoint().listen(new GetRequestsController());
