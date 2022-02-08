import {
  CreateProfileParams,
  ProfileCondition,
  ProfileEndpoint,
  ProfileSpecifier,
  SearchProfileParams
} from "../../app";
import { AuthEndpoint } from "../../auth";
import { ProfileCreatedMessage, ProfileDeletedMessage, ProfileListMessage } from "../views";
import { DiscordUser, Communicator } from "../structures";
import { toProfileBodyView } from "./converter";

export class ProfileRunner {
  constructor(private readonly authEndpoint: AuthEndpoint, private readonly profileEndpoint: ProfileEndpoint) {}

  public async create(communicator: Communicator<CreateProfileParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.profileEndpoint.create(clientId, communicator.getProps());

    const author = new DiscordUser(profile.author.discordId, profile.author.enableMention);
    const owner = new DiscordUser(profile.owner.discordId, profile.owner.enableMention);
    const replyMessage = new ProfileCreatedMessage(toProfileBodyView(profile));
    await communicator.reply(replyMessage, { mentions: [author, owner] });
  }

  public async delete(communicator: Communicator<ProfileSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.profileEndpoint.delete(clientId, communicator.getProps());

    const replyMessage = new ProfileDeletedMessage(toProfileBodyView(profile));
    await communicator.reply(replyMessage);
  }

  public async random(communicator: Communicator<ProfileCondition>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profiles = await this.profileEndpoint.random(clientId, communicator.getProps());

    const replyMessage = new ProfileListMessage(profiles.map((profile) => toProfileBodyView(profile)));
    await communicator.reply(replyMessage);
  }

  public async search(communicator: Communicator<SearchProfileParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profiles = await this.profileEndpoint.search(clientId, communicator.getProps());

    const replyMessage = new ProfileListMessage(profiles.map((profile) => toProfileBodyView(profile)));
    await communicator.reply(replyMessage);
  }

  public async show(communicator: Communicator<ProfileSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.profileEndpoint.find(clientId, communicator.getProps());

    const replyMessage = new ProfileListMessage([toProfileBodyView(profile)]);
    await communicator.reply(replyMessage);
  }
}
