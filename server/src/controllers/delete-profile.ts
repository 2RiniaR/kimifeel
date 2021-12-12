import { ControllerFor } from "controllers/controller";
import { ClientUser } from "models/structures";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "endpoints";
import { ProfileNotFoundEndpointError } from "endpoints/errors";

export class DeleteProfileController extends ControllerFor<DeleteProfileEndpoint> {
  async action(ctx: DeleteProfileEndpointParams, client: ClientUser): Promise<DeleteProfileEndpointResult> {
    const profile = await client.asUser().getProfileByIndex(ctx.index);
    if (!profile) throw new ProfileNotFoundEndpointError();
    const author = await client.users.fetch(profile.author);
    const result: DeleteProfileEndpointResult = {
      index: profile.index,
      content: profile.content,
      authorDiscordId: author.discordId
    };
    await profile.delete();
    return result;
  }
}
