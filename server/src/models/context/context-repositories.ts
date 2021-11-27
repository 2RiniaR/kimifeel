import { UserRepository } from "~/models/repositories/user-repository";
import { ProfileRepository } from "~/models/repositories/profile-repository";
import { RequestRepository } from "~/models/repositories/request-repository";
import { Context } from "./context";

export class ContextRepositories {
  users: UserRepository;
  profiles: ProfileRepository;
  requests: RequestRepository;

  constructor(ctx: Context) {
    this.users = new UserRepository(ctx);
    this.profiles = new ProfileRepository(ctx);
    this.requests = new RequestRepository(ctx);
  }
}
