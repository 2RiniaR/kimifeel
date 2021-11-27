import { Context } from "./context";
import { ContextRepositories } from "~/models/context/context-repositories";

export abstract class ContextModel {
  public context: Context;
  public repositories: ContextRepositories;

  public constructor(ctx: Context) {
    this.context = ctx;
    this.repositories = new ContextRepositories(ctx);
  }
}
