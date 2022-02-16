import { Client, ClientUser, Intents, Interaction, Message, MessageReaction, User } from "discord.js";
import { fetchReaction, fetchUser } from "../fetch";

export interface DiscordTokenProvider {
  discordToken: string;
}

export class ClientImpl {
  private readonly raw = new Client({
    partials: ["CHANNEL"],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
  });

  public constructor(private readonly tokenProvider: DiscordTokenProvider) {
    this.tokenProvider = tokenProvider;
    this.raw.on("ready", () => {
      if (this.raw.user === null) return;
      console.log(`Logged in as ${this.raw.user.tag}!`);
    });
  }

  public async initialize() {
    await this.raw.login(this.tokenProvider.discordToken);
  }

  public get user(): ClientUser | undefined {
    return this.raw.user ?? undefined;
  }

  public onInteractionCreated(handler: (interaction: Interaction) => PromiseLike<void>) {
    this.raw.on("interactionCreate", async (interaction) => handler(interaction));
  }

  public onMessageCreated(handler: (message: Message) => PromiseLike<void>) {
    this.raw.on("messageCreate", async (message) => handler(message));
  }

  public onReactionAdd(handler: (reaction: MessageReaction, user: User) => PromiseLike<void>) {
    this.raw.on("messageReactionAdd", async (reaction, user) =>
      handler(await fetchReaction(reaction), await fetchUser(user))
    );
  }
}
