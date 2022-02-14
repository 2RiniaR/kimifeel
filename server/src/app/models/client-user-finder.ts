import { UserRepository } from "data-store";
import { ClientUser } from "./client-user";
import { withConvertRepositoryErrors } from "./errors";

export class ClientUserFinder {
  private readonly service = new ClientUserFinderService();

  public async find(id: string): Promise<ClientUser | undefined> {
    return await this.service.find(id);
  }
}

class ClientUserFinderService {
  public async find(id: string): Promise<ClientUser | undefined> {
    const result = await withConvertRepositoryErrors.invoke(() => new UserRepository().find({ id }));
    if (!result) return;
    return ClientUser.fromQuery(result);
  }
}
