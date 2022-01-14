import { DataAccessFailedError, DiscordIdFormatError, UserAlreadyRegisteredError } from "../errors";
import * as db from "../../prisma";
import { buildClientUser } from "../builders/client-user";

const snowflakeRegex = /^(\d+)$/;

export class ImaginaryUser {
  private readonly service = new ImaginaryUserService(this);
  public readonly discordId: string;

  public constructor(props: CreateUserProps) {
    this.discordId = props.discordId;
    this.checkDiscordIdFormat();
  }

  private checkDiscordIdFormat() {
    const match = this.discordId.match(snowflakeRegex);
    if (!match) {
      throw new DiscordIdFormatError();
    }
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateUserProps = {
  discordId: string;
};

class ImaginaryUserService {
  private readonly user: ImaginaryUser;

  public constructor(user: ImaginaryUser) {
    this.user = user;
  }

  public async create() {
    let result;
    try {
      result = await db.createUser({ discordId: this.user.discordId });
    } catch (error) {
      if (error instanceof db.DiscordIdDuplicatedError) {
        throw new UserAlreadyRegisteredError();
      }
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return buildClientUser(result);
  }
}
