import { IdentityUser, UserIdentifier } from "./identity-user";
import { Context } from "../context";

export class User extends IdentityUser {
  public constructor(ctx: Context, props: UserIdentifier & UserProps) {
    super(ctx, props);
  }
}

export type UserProps = {
  /* nothing */
};
