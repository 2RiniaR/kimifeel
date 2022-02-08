import { bold, codeBlock, italic } from "./elements";

export class ProfileSpecifierView {
  public constructor(public readonly index: number) {}

  public call(): string {
    return bold(`No.${this.index}`);
  }
}

export class ProfileBodyView extends ProfileSpecifierView {
  public readonly owner: UserSpecifierView;
  public readonly author: UserSpecifierView;

  public constructor(index: number, public readonly content: string, ownerId: string, authorId: string) {
    super(index);
    this.owner = new UserSpecifierView(ownerId);
    this.author = new UserSpecifierView(authorId);
  }

  public abstract(): string {
    return `${bold(`No.${this.index}`)} ${this.owner.mention()} ―――― ${italic(`by ${this.author.mention()}`)}`;
  }

  public detail(): string {
    return [
      `${bold(`No.${this.index}`)} ${this.owner.mention()}`,
      codeBlock(this.content),
      `―――― ${italic(`by ${this.author.mention()}`)}`
    ].join("\n");
  }
}

export class RequestSpecifierView {
  public constructor(public readonly index: number) {}

  public call(): string {
    return bold(`No.${this.index}`);
  }
}

export class RequestBodyView extends RequestSpecifierView {
  public readonly target: UserSpecifierView;
  public readonly applicant: UserSpecifierView;

  public constructor(index: number, public readonly content: string, targetId: string, applicantId: string) {
    super(index);
    this.target = new UserSpecifierView(targetId);
    this.applicant = new UserSpecifierView(applicantId);
  }

  public abstract(): string {
    return `${this.call()} ${this.target.mention()} ―――― ${italic(`by ${this.applicant.mention()}`)}`;
  }

  public detail(): string {
    return [
      `${this.call()} ${this.target.mention()}`,
      codeBlock(this.content),
      `―――― ${italic(`by ${this.applicant.mention()}`)}`
    ].join("\n");
  }

  public reviewCard(): string {
    const content = codeBlock(this.content);
    const targetActions = [
      this.target.mention(),
      "承認→✅のリアクションを付ける",
      "拒否→❌のリアクションを付ける"
    ].join("\n");
    const applicantActions = [this.applicant.mention(), "キャンセル→⛔のリアクションを付ける"].join("\n");
    return [content, targetActions, "", applicantActions].join("\n");
  }
}

export class UserSpecifierView {
  public constructor(public readonly id: string) {}
  private static unpackMentionRegex = /^<@(\d+)>$/;

  public mention(): string {
    return `<@${this.id}>`;
  }

  public static fromMention(mention: string): UserSpecifierView {
    const id = mention.replace(UserSpecifierView.unpackMentionRegex, "$1");
    return new UserSpecifierView(id);
  }
}

export class UserBodyView extends UserSpecifierView {
  public constructor(id: string, public readonly enableMention: boolean) {
    super(id);
  }

  public detail(): string {
    return [this.mention(), codeBlock(`メンション: ${this.enableMention ? "ON" : "OFF"}`)].join("\n");
  }
}

export class UserStatsBodyView extends UserSpecifierView {
  public constructor(
    id: string,
    public readonly ownedProfileCount: number,
    public readonly selfProfileCount: number,
    public readonly writtenProfileCount: number
  ) {
    super(id);
  }

  public detail(): string {
    const owned = `書かれたプロフィール: ${this.ownedProfileCount} 件 (うち自己紹介 ${this.selfProfileCount} 件)`;
    const written = `書いたプロフィール: ${this.writtenProfileCount} 件`;
    return [this.mention(), codeBlock([owned, written].join("\n"))].join("\n");
  }
}
