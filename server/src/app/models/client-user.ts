import { RawUser } from "data-store";
import { Context } from "./context";
import { User, UserIdentifier, UserProps } from "./user";
import { ProfileFinder } from "./profile-finder";
import { UserFinder } from "./user-finder";
import { RequestFinder } from "./request-finder";

export class ClientUser {
  public readonly discordId: string;
  public readonly id: string;
  public readonly enableMention: boolean;

  private readonly context: Context;
  public readonly users: UserFinder;
  public readonly profiles: ProfileFinder;
  public readonly requests: RequestFinder;

  public constructor(props: UserIdentifier & UserProps) {
    this.id = props.id;
    this.discordId = props.discordId;
    this.enableMention = props.enableMention;

    this.context = { clientUser: this };
    this.users = new UserFinder(this.context);
    this.profiles = new ProfileFinder(this.context);
    this.requests = new RequestFinder(this.context);
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
