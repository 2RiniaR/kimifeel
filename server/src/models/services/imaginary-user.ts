import { ImaginaryUser } from "../structures";
import * as db from "../../prisma";
import { buildClientUser } from "../builders/client-user";

export class ImaginaryUserService {
  private readonly user: ImaginaryUser;

  public constructor(user: ImaginaryUser) {
    this.user = user;
  }

  public async create() {
    const result = await db.createUser({ discordId: this.user.discordId });
    return buildClientUser(result);
  }
}
