import { DiscordIdFormatError, UserAlreadyRegisteredError, withHandleRepositoryErrors } from "../errors";
import { DiscordIdDuplicatedError, UserRepository } from "../../../prisma";
import { AuthorizedUser } from "./authorized-user";

const snowflakeRegex = /^(\d+)$/;

export class ImaginaryAuthorizedUser {
  private readonly service = new ImaginaryDiscordUserService(this);
  public readonly discordId: string;

  public constructor({ discordId }: CreateUserProps) {
    this.discordId = discordId;
    this.checkDiscordIdFormat();
  }

  private checkDiscordIdFormat() {
    const match = this.discordId.match(snowflakeRegex);
    if (!match) throw new DiscordIdFormatError();
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateUserProps = {
  discordId: string;
};

class ImaginaryDiscordUserService {
  public constructor(private readonly user: ImaginaryAuthorizedUser) {}

  public async create(): Promise<AuthorizedUser> {
    const result = await withHandleRepositoryErrors(() => {
      try {
        return new UserRepository().create({ discordId: this.user.discordId });
      } catch (error) {
        if (error instanceof DiscordIdDuplicatedError) {
          throw new UserAlreadyRegisteredError();
        }
        throw error;
      }
    });
    return AuthorizedUser.fromRaw(result);
  }
}
