import { NotFoundError, withHandleRepositoryErrors } from "../errors";
import { RawUser, UserRepository } from "../../../prisma";

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
    const result = await withHandleRepositoryErrors(() => new UserRepository().delete({ id: this.user.id }));
    if (!result) throw new NotFoundError();
    return AuthorizedUser.fromRaw(result);
  }
}
