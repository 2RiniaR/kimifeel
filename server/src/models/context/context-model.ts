import { Context, ContextRepositories } from ".";

export abstract class ContextModel {
  public context: Context;
  public repositories: ContextRepositories;

  public constructor(ctx: Context) {
    this.context = ctx;
    console.log("ContextModel-1");
    this.repositories = new ContextRepositories(ctx);
  }
}
