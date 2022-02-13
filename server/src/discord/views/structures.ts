import { bold, codeBlock, italic } from "./format";
import {
  Profile,
  ProfileIdentity,
  DiscordUserIdentity,
  RequestIdentity,
  Request,
  DiscordUser,
  DiscordUserStats
} from "../structures";

export class ProfileIdentityView {
  public constructor(public readonly profile: ProfileIdentity) {}

  public call(): string {
    return bold(`No.${this.profile.index}`);
  }
}

export class ProfileView extends ProfileIdentityView {
  public readonly owner: UserIdentityView;
  public readonly author: UserIdentityView;

  public constructor(public readonly profile: Profile) {
    super(profile);
    this.owner = new UserIdentityView(profile.owner);
    this.author = new UserIdentityView(profile.author);
  }

  public abstract(): string {
    return `${bold(`No.${this.profile.index}`)} ${this.owner.mention()} ―――― ${italic(`by ${this.author.mention()}`)}`;
  }

  public detail(): string {
    return [
      `${bold(`No.${this.profile.index}`)} ${this.owner.mention()}`,
      codeBlock(this.profile.content),
      `―――― ${italic(`by ${this.author.mention()}`)}`
    ].join("\n");
  }
}

export class RequestIdentityView {
  public constructor(public readonly request: RequestIdentity) {}

  public call(): string {
    return bold(`No.${this.request.index}`);
  }
}

export class RequestView extends RequestIdentityView {
  public readonly target: UserIdentityView;
  public readonly applicant: UserIdentityView;

  public constructor(public readonly request: Request) {
    super(request);
    this.target = new UserIdentityView(request.target);
    this.applicant = new UserIdentityView(request.applicant);
  }

  public abstract(): string {
    return `${this.call()} ${this.target.mention()} ―――― ${italic(`by ${this.applicant.mention()}`)}`;
  }

  public detail(): string {
    return [
      `${this.call()} ${this.target.mention()}`,
      codeBlock(this.request.content),
      `―――― ${italic(`by ${this.applicant.mention()}`)}`
    ].join("\n");
  }

  public reviewCard(): string {
    const content = codeBlock(this.request.content);
    const targetActions = [
      this.target.mention(),
      "承認→✅のリアクションを付ける",
      "拒否→❌のリアクションを付ける"
    ].join("\n");
    const applicantActions = [this.applicant.mention(), "キャンセル→⛔のリアクションを付ける"].join("\n");
    return [content, targetActions, "", applicantActions].join("\n");
  }
}

export class UserIdentityView {
  public constructor(public readonly user: DiscordUserIdentity) {}
  private static unpackMentionRegex = /^<@(\d+)>$/;

  public mention(): string {
    return `<@${this.user.id}>`;
  }

  public static fromMention(mention: string): UserIdentityView {
    const id = mention.replace(UserIdentityView.unpackMentionRegex, "$1");
    return new UserIdentityView({ id });
  }
}

export class UserView extends UserIdentityView {
  public constructor(public readonly user: DiscordUser) {
    super(user);
  }

  public detail(): string {
    return [this.mention(), codeBlock(`メンション: ${this.user.enableMention ? "ON" : "OFF"}`)].join("\n");
  }
}

export class UserStatsView extends UserIdentityView {
  public constructor(public readonly stats: DiscordUserStats) {
    super(stats);
  }

  public detail(): string {
    const owned = `書かれたプロフィール: ${this.stats.ownedProfileCount} 件 (うち自己紹介 ${this.stats.selfProfileCount} 件)`;
    const written = `書いたプロフィール: ${this.stats.writtenProfileCount} 件`;
    return [this.mention(), codeBlock([owned, written].join("\n"))].join("\n");
  }
}
