import { UserIdentityView } from "../views";
import { DiscordUser } from "../structures";

export class UsersMention {
  public constructor(public readonly users: DiscordUser[]) {}

  public getContent(): string | undefined {
    const targets = this.users.filter((user) => user.enableMention);
    if (targets.length === 0) return;
    const users = targets.map((target) => new UserIdentityView({ id: target.id }));
    return users.map((user) => user.mention()).join(" ");
  }
}
