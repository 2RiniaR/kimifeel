import { UserRepository } from "~/models/repositories/user-repository";
import { ProfileRepository } from "~/models/repositories/profile-repository";
import { RequestRepository } from "~/models/repositories/request-repository";

export class ContextRepositories {
  users: UserRepository;
  profiles: ProfileRepository;
  requests: RequestRepository;

  constructor() {
    this.users = new UserRepository();
    this.profiles = new ProfileRepository();
    this.requests = new RequestRepository();
  }
}
