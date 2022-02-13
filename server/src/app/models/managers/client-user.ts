import { UserRepository } from "data-store";
import { ClientUser } from "../structures";
import { withConvertRepositoryErrors } from "../errors";

export class ClientUserManager {
  private readonly service = new ClientUserManagerService();

  public async find(id: string): Promise<ClientUser | undefined> {
    return await this.service.find(id);
  }
}

export class ClientUserManagerService {
  public async find(id: string): Promise<ClientUser | undefined> {
    const result = await withConvertRepositoryErrors.invoke(() => new UserRepository().find({ id }));
    if (!result) return;
    return ClientUser.fromQuery(result);
  }
}
