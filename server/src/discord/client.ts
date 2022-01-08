import { Client, ClientUser, Intents, Interaction, Message, MessageReaction, User } from "discord.js";
import { fetchReaction, fetchUser } from "./fetch";

export interface DiscordTokenProvider {
  discordToken: string;
}

export class ClientManager {
  private readonly tokenProvider: DiscordTokenProvider;
  private readonly _client = new Client({
    partials: ["CHANNEL"],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
  });

  public constructor(tokenProvider: DiscordTokenProvider) {
    this.tokenProvider = tokenProvider;
    this._client.on("ready", () => {
      if (!this._client.user) return;
      console.log(`Logged in as ${this._client.user.tag}!`);
    });
  }

  public async initialize() {
    await this._client.login(this.tokenProvider.discordToken);
  }

  public get user(): ClientUser | undefined {
    return this._client.user ?? undefined;
  }

  onInteractionCreated(handler: (interaction: Interaction) => PromiseLike<void>): void {
    this._client.on("interactionCreate", async (interaction) => handler(interaction));
  }

  onMessageCreated(handler: (message: Message) => PromiseLike<void>): void {
    this._client.on("messageCreate", async (message) => handler(message));
  }

  onReactionAdd(handler: (reaction: MessageReaction, user: User) => PromiseLike<void>): void {
    this._client.on("messageReactionAdd", async (reaction, user) =>
      handler(await fetchReaction(reaction), await fetchUser(user))
    );
  }
}
