import { Controller } from "controller";
import { AddProfileAction, AddProfileParams, AddProfileResult } from "discord/actions";
import { ProfileContentLengthLimitActionError } from "discord/errors";
import { ClientUser } from "models/structures";
import { ContentLengthLimitError } from "models/errors";

export class AddProfileController extends Controller<AddProfileAction> {
  async action(ctx: AddProfileParams, client: ClientUser): Promise<AddProfileResult> {
    try {
      const profile = await client.asUser().addProfile(ctx.content);
      const author = await client.users.fetch(profile.author);
      return {
        index: profile.index,
        content: profile.content,
        authorUserId: author.discordId
      };
    } catch (error) {
      if (error instanceof ContentLengthLimitError) {
        throw new ProfileContentLengthLimitActionError(error.min, error.max, error.actual);
      } else {
        throw error;
      }
    }
  }
}
