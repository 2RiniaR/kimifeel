import { AuthorizedUser } from "./authorized-user";
import { withHandleRepositoryErrors } from "../errors";
import { ImaginaryAuthorizedUser } from "./imaginary-authorized-user";
import { UserRepository } from "../../../prisma";

export class DiscordUser {
  private readonly service = new DiscordUserService(this);

  public constructor(public readonly discordId: string) {}

  public async authorize(): Promise<AuthorizedUser | undefined> {
    return this.service.authorize();
  }

  public async register(): Promise<AuthorizedUser> {
    return this.service.register();
  }
}

class DiscordUserService {
  constructor(private readonly user: DiscordUser) {}

  public async authorize(): Promise<AuthorizedUser | undefined> {
    const result = await withHandleRepositoryErrors(() =>
      new UserRepository().find({ discordId: this.user.discordId })
    );
    if (!result) return;
    return AuthorizedUser.fromRaw(result);
  }

  public async register(): Promise<AuthorizedUser> {
    const user = new ImaginaryAuthorizedUser({ discordId: this.user.discordId });
    return user.create();
  }
}
