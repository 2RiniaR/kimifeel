import { DiscordIdDuplicatedError, UserRepository } from "data-store";
import { UserAlreadyRegisteredError, withConvertRepositoryErrors } from "../errors";
import { AuthorizedUser } from "./authorized-user";

export type CreateUserProps = {
  readonly discordId: string;
};

export class ImaginaryAuthorizedUser {
  private readonly service = new ImaginaryDiscordUserService(this);
  public readonly discordId: string;

  public constructor({ discordId }: CreateUserProps) {
    this.discordId = discordId;
  }

  public async create() {
    return await this.service.create();
  }
}

class ImaginaryDiscordUserService {
  public constructor(private readonly user: ImaginaryAuthorizedUser) {}

  public async create(): Promise<AuthorizedUser> {
    const result = await withConvertRepositoryErrors
      .guard((error) => {
        if (error instanceof DiscordIdDuplicatedError) throw new UserAlreadyRegisteredError();
      })
      .invokeAsync(() => new UserRepository().create({ discordId: this.user.discordId }));
    return AuthorizedUser.fromRaw(result);
  }
}
