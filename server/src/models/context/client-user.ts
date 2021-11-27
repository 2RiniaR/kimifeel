import { Context, ContextServices } from ".";
import { User, UserIdentifier, UserProps } from "../structures/user";

export class ClientUser implements UserIdentifier, UserProps {
  public discordId: string;
  public id: string;
  public readonly services: ContextServices;
  public readonly user: User;
  private readonly context: Context;

  public constructor(props: UserIdentifier & UserProps) {
    this.id = props.id;
    this.discordId = props.discordId;
    this.context = new Context(this);
    this.user = new User(this.context, this);
    this.services = new ContextServices(this.context);
  }
}
