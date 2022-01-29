import { User } from "../structures";
import { ContextModel } from "../context-model";
import * as db from "../../prisma";
import { DataAccessFailedError } from "../errors";
import { buildUser } from "../builders/user";

export class UserManager extends ContextModel {
  private readonly service = new UserManagerService(this.context);

  public async findByDiscordId(discordId: string): Promise<User | undefined> {
    return await this.service.findByDiscordId(discordId);
  }

  public async findManyByDiscordId(discordId: string[]): Promise<User[]> {
    return await this.service.findManyByDiscordId(discordId);
  }
}

export class UserManagerService extends ContextModel {
  public async findByDiscordId(discordId: string): Promise<User | undefined> {
    let result;
    try {
      result = await db.findUserByDiscordId(discordId);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) return;
    return buildUser(this.context, result);
  }

  public async findManyByDiscordId(discordId: string[]): Promise<User[]> {
    let results;
    try {
      results = await db.findManyUserByDiscordId(discordId);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return results.map((result) => buildUser(this.context, result));
  }
}
