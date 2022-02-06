import { ClientUser } from "../../models/structures";
import { ClientUserManager } from "../../models/managers";
import * as EndpointError from "../../endpoints/errors";
import { withHandleModelErrors } from "../errors";

export class ClientUserService {
  async getById(id: string): Promise<ClientUser> {
    const client = await withHandleModelErrors(() => new ClientUserManager().find(id));
    if (!client) throw new EndpointError.ClientUserNotExistError();
    return client;
  }
}
