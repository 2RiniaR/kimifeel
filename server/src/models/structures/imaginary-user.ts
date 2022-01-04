import { ImaginaryUserService } from "../services";
import * as db from "../../prisma";

const snowflakeRegex = /^(\d+)$/;

export class DiscordIdFormatError extends Error {}
export class UserAlreadyRegisteredError extends Error {}

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
    try {
      return await this.service.create();
    } catch (error) {
      if (error instanceof db.DiscordIdDuplicatedError) {
        throw new UserAlreadyRegisteredError();
      }
      throw error;
    }
  }
}

export type CreateUserProps = {
  discordId: string;
};
