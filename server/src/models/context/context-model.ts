import { Context, ContextRepositories } from ".";

export abstract class ContextModel {
  public context: Context;
  public repositories: ContextRepositories;

  public constructor(ctx: Context) {
    this.context = ctx;
    this.repositories = new ContextRepositories();
  }
}
