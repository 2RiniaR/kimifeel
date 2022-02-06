import { Communicator } from "./communicator";
import { CreateProfileParams, ProfileBody, ProfileEndpoint, ProfileSpecifier } from "../../app/endpoints";
import { AuthEndpoint } from "../../auth/endpoints/auth";
import { ProfileCreatedMessage, ProfileDeletedMessage, ProfileProps } from "../views";
import { DiscordUser } from "../structures";

export class ProfileRunner {
  constructor(private readonly authEndpoint: AuthEndpoint, private readonly profileEndpoint: ProfileEndpoint) {}

  private static toMessageProps(body: ProfileBody): ProfileProps {
    return {
      index: body.index,
      content: body.content,
      authorUserId: body.author.discordId,
      ownerUserId: body.owner.discordId
    };
  }

  public async create(communicator: Communicator<CreateProfileParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.profileEndpoint.create(clientId, communicator.getProps());

    const author = new DiscordUser(profile.author.discordId, profile.author.enableMention);
    const owner = new DiscordUser(profile.owner.discordId, profile.owner.enableMention);
    const replyMessage = new ProfileCreatedMessage(ProfileRunner.toMessageProps(profile));
    await communicator.reply(replyMessage, { mentions: [author, owner] });
  }

  public async delete(communicator: Communicator<ProfileSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.profileEndpoint.delete(clientId, communicator.getProps());

    const replyMessage = new ProfileDeletedMessage(ProfileRunner.toMessageProps(profile));
    await communicator.reply(replyMessage);
  }
}
