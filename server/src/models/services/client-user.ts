import { ClientUser } from "../structures";
import { deleteUser } from "../../prisma/queries/users/delete";
import { buildClientUser } from "../builders/client-user";
import { NotFoundError } from "../errors";

export class ClientUserService {
  private readonly user: ClientUser;

  public constructor(user: ClientUser) {
    this.user = user;
  }

  public async unregister(): Promise<ClientUser> {
    const result = await deleteUser(this.user.id);
    if (!result) {
      throw new NotFoundError();
    }
    return buildClientUser(result);
  }
}
