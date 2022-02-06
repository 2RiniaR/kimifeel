import { ClientUser } from "./structures";

export class Context {
  public readonly clientUser: ClientUser;

  constructor(clientUser: ClientUser) {
    this.clientUser = clientUser;
  }
}

export abstract class ContextModel {
  public readonly context: Context;

  public constructor(ctx: Context) {
    this.context = ctx;
  }
}
