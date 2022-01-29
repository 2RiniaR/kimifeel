import { Context } from "../context";
import { ProfileManager, RequestManager, UserManager } from "../managers";
import { User, UserIdentifier, UserProps } from "./user";
import { DataAccessFailedError, NotFoundError } from "../errors";
import { buildClientUser } from "../builders/client-user";
import * as db from "../../prisma";

export class ClientUser {
  private readonly service = new ClientUserService(this);

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

  public async unregister(): Promise<ClientUser> {
    return await this.service.unregister();
  }
}

class ClientUserService {
  private readonly user: ClientUser;

  public constructor(user: ClientUser) {
    this.user = user;
  }

  public async unregister(): Promise<ClientUser> {
    let result;
    try {
      result = await db.deleteUser(this.user.id);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) {
      throw new NotFoundError();
    }
    return buildClientUser(result);
  }
}
