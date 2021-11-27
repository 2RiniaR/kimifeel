import { ClientUser } from "./client-user";

export class Context {
  public readonly clientUser: ClientUser;

  constructor(clientUser: ClientUser) {
    this.clientUser = clientUser;
  }
}
