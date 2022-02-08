import { DiscordUser } from "../structures";
import { UserSpecifierView } from "./structures";

export class UsersMention {
  public constructor(public readonly users: DiscordUser[]) {}

  public getContent(): string | undefined {
    const targets = this.users.filter((user) => user.enableMention);
    if (targets.length === 0) return;
    const users = targets.map((target) => new UserSpecifierView(target.id));
    return users.map((user) => user.mention()).join(" ");
  }
}
