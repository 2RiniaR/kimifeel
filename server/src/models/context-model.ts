import { Context } from "./context";

export abstract class ContextModel {
  public readonly context: Context;

  public constructor(ctx: Context) {
    this.context = ctx;
  }
}
