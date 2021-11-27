import { UserService } from "~/models/services/user-service";
import { ProfileService } from "~/models/services/profile-service";
import { RequestService } from "~/models/services/request-service";
import { Context } from "./context";

export class ContextServices {
  users: UserService;
  profiles: ProfileService;
  requests: RequestService;

  constructor(ctx: Context) {
    this.users = new UserService(ctx);
    this.profiles = new ProfileService(ctx);
    this.requests = new RequestService(ctx);
  }
}
