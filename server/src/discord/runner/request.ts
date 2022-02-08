import { CreateRequestParams, RequestEndpoint, RequestSpecifier, SearchRequestParams } from "../../app";
import { AuthEndpoint } from "../../auth";
import {
  RequestAcceptedMessage,
  RequestCanceledMessage,
  RequestDeniedMessage,
  RequestListMessage,
  RequestSentMessage
} from "../views";
import { DiscordUser, Communicator } from "../structures";
import { toProfileBodyView, toRequestBodyView } from "./converter";

export class RequestRunner {
  constructor(private readonly authEndpoint: AuthEndpoint, private readonly requestEndpoint: RequestEndpoint) {}

  public async accept(communicator: Communicator<RequestSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const profile = await this.requestEndpoint.accept(clientId, communicator.getProps());

    const author = new DiscordUser(profile.author.discordId, profile.author.enableMention);
    const owner = new DiscordUser(profile.owner.discordId, profile.owner.enableMention);
    const replyMessage = new RequestAcceptedMessage(toProfileBodyView(profile));
    await communicator.reply(replyMessage, { mentions: [author, owner] });
  }

  public async cancel(communicator: Communicator<RequestSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const request = await this.requestEndpoint.cancel(clientId, communicator.getProps());

    const replyMessage = new RequestCanceledMessage(toRequestBodyView(request));
    await communicator.reply(replyMessage);
  }

  public async deny(communicator: Communicator<RequestSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const request = await this.requestEndpoint.deny(clientId, communicator.getProps());

    const replyMessage = new RequestDeniedMessage(toRequestBodyView(request));
    await communicator.reply(replyMessage);
  }

  public async send(communicator: Communicator<CreateRequestParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const request = await this.requestEndpoint.create(clientId, communicator.getProps());

    const replyMessage = new RequestSentMessage(toRequestBodyView(request));
    await communicator.reply(replyMessage, { reactions: ["✅", "⛔", "❌"] });
  }

  public async search(communicator: Communicator<SearchRequestParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const requests = await this.requestEndpoint.search(clientId, communicator.getProps());

    const replyMessage = new RequestListMessage(requests.map((request) => toRequestBodyView(request)));
    await communicator.reply(replyMessage);
  }

  public async show(communicator: Communicator<RequestSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const request = await this.requestEndpoint.find(clientId, communicator.getProps());

    const replyMessage = new RequestListMessage([toRequestBodyView(request)]);
    await communicator.reply(replyMessage);
  }
}
