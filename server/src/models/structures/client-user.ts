import { Context } from "../context";
import { ProfileManager } from "../managers/profile-manager";
import { RequestManager } from "../managers/request-manager";
import { User, UserProps } from "./user";
import { UserIdentifier } from "./identity-user";
import { UserManager } from "../managers/user-manager";

export class ClientUser {
  public readonly discordId: string;
  public readonly id: string;
  private readonly context: Context;
  public readonly users: UserManager;
  public readonly profiles: ProfileManager;
  public readonly requests: RequestManager;

  public constructor(props: UserIdentifier & UserProps) {
    this.id = props.id;
    this.discordId = props.discordId;
    this.context = new Context(this);
    this.users = new UserManager(this.context);
    this.profiles = new ProfileManager(this.context);
    this.requests = new RequestManager(this.context);
  }

  public asUser() {
    return new User(this.context, this);
  }
}
