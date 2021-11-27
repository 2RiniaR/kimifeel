import { Client, Guild, GuildMember } from "discord.js";
import { settingsManager } from "~/settings";

export class TargetGuildManager {
  private readonly client: Client;
  private targetGuild?: Guild;

  constructor(client: Client) {
    this.client = client;
  }

  public async getTargetGuild(): Promise<Guild> {
    if (!this.targetGuild) {
      this.targetGuild = await this.client.guilds.fetch(settingsManager.values.targetGuildId);
    }
    return this.targetGuild;
  }

  public async getMember(id: string): Promise<GuildMember | null> {
    const guild = await this.getTargetGuild();
    return await guild.members.fetch(id);
  }

  public async getMembers(id: string[]): Promise<GuildMember[]> {
    const guild = await this.getTargetGuild();
    const result = await guild.members.fetch({ user: id });
    return Array.from(result.values());
  }
}
