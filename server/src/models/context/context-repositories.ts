import { Context } from ".";
import { UserRepository } from "~/models/repositories/user-repository";
import { ProfileRepository } from "~/models/repositories/profile-repository";
import { RequestRepository } from "~/models/repositories/request-repository";

export class ContextRepositories {
  users: UserRepository;
  profiles: ProfileRepository;
  requests: RequestRepository;

  constructor(ctx: Context) {
    this.users = new UserRepository(ctx);
    console.log("ContextRepositories-1");
    this.profiles = new ProfileRepository(ctx);
    console.log("ContextRepositories-2");
    this.requests = new RequestRepository(ctx);
  }
}
