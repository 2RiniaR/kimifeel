import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { IdentityProfile, ProfileIdentifier } from "./identity-profile";

export class Profile extends IdentityProfile {
  public readonly author: IdentityUser;
  public readonly content: string;

  public constructor(ctx: Context, props: ProfileIdentifier & ProfileProps) {
    super(ctx, props);
    this.author = props.author;
    this.content = props.content;
  }
}

export type ProfileProps = {
  content: string;
  author: IdentityUser;
};
