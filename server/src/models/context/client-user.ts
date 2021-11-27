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
    console.log("ClientUser-1");
    this.context = new Context(this);
    console.log("ClientUser-2");
    this.user = new User(this.context, this);
    console.log("ClientUser-3");
    this.services = new ContextServices(this.context);
    console.log("ClientUser-4");
  }
}
