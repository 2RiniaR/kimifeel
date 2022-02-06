import { ClientUser } from "../structures";
import { withHandleRepositoryErrors } from "../errors";
import { UserRepository } from "../../../prisma";

export class ClientUserManager {
  private readonly service = new ClientUserManagerService();

  public async find(id: string): Promise<ClientUser | undefined> {
    return await this.service.find(id);
  }
}

export class ClientUserManagerService {
  public async find(id: string): Promise<ClientUser | undefined> {
    const result = await withHandleRepositoryErrors(() => new UserRepository().find({ id }));
    if (!result) return;
    return ClientUser.fromQuery(result);
  }
}
