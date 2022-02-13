import { RawUser } from "data-store";
import { Context } from "../context";
import { ProfileManager, RequestManager, UserManager } from "../managers";
import { User, UserIdentifier, UserProps } from "./user";

export class ClientUser {
  public readonly discordId: string;
  public readonly id: string;
  public readonly enableMention: boolean;

  private readonly context: Context;
  public readonly users: UserManager;
  public readonly profiles: ProfileManager;
  public readonly requests: RequestManager;

  public constructor(props: UserIdentifier & UserProps) {
    this.id = props.id;
    this.discordId = props.discordId;
    this.enableMention = props.enableMention;

    this.context = new Context(this);
    this.users = new UserManager(this.context);
    this.profiles = new ProfileManager(this.context);
    this.requests = new RequestManager(this.context);
  }

  public asUser() {
    return new User(this.context, this);
  }

  public static fromQuery(result: RawUser): ClientUser {
    return new ClientUser({
      id: result.id,
      discordId: result.discordId,
      enableMention: result.enableMention
    });
  }
}
