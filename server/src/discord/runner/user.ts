import { Communicator } from "../structures";
import { UserConfigParams, UserEndpoint, UserSpecifier } from "../../app";
import { AuthEndpoint } from "../../auth";
import { UserConfiguredMessage, UserStatsMessage } from "../views";
import { toUserBodyView, toUserStatsBodyView } from "./converter";

export class UserRunner {
  constructor(private readonly authEndpoint: AuthEndpoint, private readonly userEndpoint: UserEndpoint) {}

  public async config(communicator: Communicator<UserConfigParams>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const user = await this.userEndpoint.config(clientId, communicator.getProps());

    const replyMessage = new UserConfiguredMessage(toUserBodyView(user));
    await communicator.reply(replyMessage, { showOnlySender: true });
  }

  public async stats(communicator: Communicator<UserSpecifier>) {
    const { clientId } = await this.authEndpoint.authorize({ discordId: communicator.getSenderId() });
    const user = await this.userEndpoint.getStats(clientId, communicator.getProps());

    const replyMessage = new UserStatsMessage(toUserStatsBodyView(user));
    await communicator.reply(replyMessage);
  }
}
