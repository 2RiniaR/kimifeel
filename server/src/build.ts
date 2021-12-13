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

export function buildApplication() {
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
}
