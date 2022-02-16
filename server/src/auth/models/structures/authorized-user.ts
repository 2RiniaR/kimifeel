import { RawUser, UserRepository } from "data-store";
import { NotFoundError, withConvertRepositoryErrors } from "../errors";

export class AuthorizedUser {
  private readonly service = new AuthorizedUserService(this);

  public constructor(public readonly id: string, public readonly discordId: string) {}

  public static fromRaw(result: RawUser): AuthorizedUser {
    return new AuthorizedUser(result.id, result.discordId);
  }

  public async unregister(): Promise<AuthorizedUser> {
    return this.service.unregister();
  }
}

class AuthorizedUserService {
  public constructor(private readonly user: AuthorizedUser) {}

  public async unregister(): Promise<AuthorizedUser> {
    const result = await withConvertRepositoryErrors.invokeAsync(() =>
      new UserRepository().delete({ id: this.user.id })
    );
    if (result === undefined) throw new NotFoundError();
    return AuthorizedUser.fromRaw(result);
  }
}
