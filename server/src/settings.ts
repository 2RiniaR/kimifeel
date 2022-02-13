import * as dotenv from "dotenv";
import { DiscordTokenProvider } from "./discord/adapters/structures";

export class SettingsManager implements DiscordTokenProvider {
  private _isLoaded = false;
  discordToken = "";

  public load() {
    dotenv.config();
    this.discordToken = SettingsManager.getEnvironmentVariable("DISCORD_TOKEN");
  }

  private static getEnvironmentVariable(name: string): string {
    const value = process.env[name];
    if (!value) return "";
    return value;
  }
}
