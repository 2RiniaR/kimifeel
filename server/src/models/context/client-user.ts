import { Context } from ".";
import { User, UserIdentifier, UserProps } from "../structures/user";
import { UserManager } from "~/models/managers/user-manager";
import { ProfileManager } from "~/models/managers/profile-manager";
import { RequestManager } from "~/models/managers/request-manager";

export class ClientUser implements UserIdentifier, UserProps {
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
