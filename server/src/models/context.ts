import { ClientUser } from "./structures";

export class Context {
  public readonly clientUser: ClientUser;

  constructor(clientUser: ClientUser) {
    this.clientUser = clientUser;
  }
}
