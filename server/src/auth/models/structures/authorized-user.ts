import { RawUser, UserRepository } from "data-store";
import { NotFoundError, withConvertRepositoryErrors } from "../errors";

export class AuthorizedUser {
  private readonly service = new AuthorizedUserService(this);

  constructor(public readonly id: string) {}

  public static fromRaw(result: RawUser): AuthorizedUser {
    return new AuthorizedUser(result.id);
  }

  public async unregister(): Promise<AuthorizedUser> {
    return this.service.unregister();
  }
}

class AuthorizedUserService {
  public constructor(private readonly user: AuthorizedUser) {}

  public async unregister(): Promise<AuthorizedUser> {
    const result = await withConvertRepositoryErrors.invoke(() => new UserRepository().delete({ id: this.user.id }));
    if (!result) throw new NotFoundError();
    return AuthorizedUser.fromRaw(result);
  }
}
