import { ClientUser, ClientUserFinder } from "app/models";
import * as Endpoint from "app/endpoints";
import { withConvertModelErrors } from "../errors";

export class ClientUserService {
  async getById(id: string): Promise<ClientUser> {
    const client = await withConvertModelErrors.invoke(() => new ClientUserFinder().find(id));
    if (!client) throw new Endpoint.ClientUserNotExistError();
    return client;
  }
}
