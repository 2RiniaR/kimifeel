import * as dotenv from "dotenv";
import { DiscordTokenProvider } from "./discord/adapters/structures";

export class SettingsManager implements DiscordTokenProvider {
  discordToken = "";

  public load() {
    dotenv.config();
    this.discordToken = SettingsManager.getEnvironmentVariable("DISCORD_TOKEN");
  }

  private static getEnvironmentVariable(name: string): string {
    const value = process.env[name];
    if (value === undefined) return "";
    return value;
  }
}
