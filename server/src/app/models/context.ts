import { ClientUser } from "./client-user";

export interface Context {
  readonly clientUser: ClientUser;
}

export interface ContextModel {
  readonly context: Context;
}
