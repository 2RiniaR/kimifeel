export interface DiscordUserIdentity {
  id: string;
}

export interface DiscordUser extends DiscordUserIdentity {
  enableMention: boolean;
}

export interface DiscordUserStats extends DiscordUserIdentity {
  ownedProfileCount: number;
  selfProfileCount: number;
  writtenProfileCount: number;
}
