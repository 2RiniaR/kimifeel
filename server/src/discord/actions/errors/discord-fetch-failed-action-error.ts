import { ActionError } from "./action-error";

export class DiscordFetchFailedActionError extends ActionError {
  public readonly title = "Discordの情報取得に失敗しました。";
  public readonly messageType = "error";
}
