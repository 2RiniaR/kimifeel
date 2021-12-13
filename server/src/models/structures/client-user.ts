import { Context } from "../context";
import { ProfileManager, RequestManager, UserManager } from "../managers";
import { User, UserProps } from "./user";
import { UserIdentifier } from "./identity-user";

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
