import { NotFoundError } from "~/models/errors/not-found-error";
import { createProfile, getAllProfiles } from "~/models/repositories/queries/profile";
import { buildProfile } from "~/models/repositories/builders/profile";
import { getUserById } from "~/models/repositories/queries/user";
import { buildUser } from "~/models/repositories/builders/user";
import { createRequest } from "~/models/repositories/queries/request";
import { buildRequest } from "~/models/repositories/builders/request";
import { AddProfileProps, SubmitRequestProps, User } from "~/models/structures/user";
import { ContextModel } from "~/models/context";
import { Request } from "~/models/structures/request";
import { Profile } from "~/models/structures/profile";

export class UserService extends ContextModel {
  private readonly user: User;

  public constructor(user: User) {
    super(user.context);
    this.user = user;
  }

  public async fetch() {
    const result = await getUserById(this.user.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    const user = buildUser(this.context, result);
    this.user.setProps(user);
  }

  public async submitRequest(props: SubmitRequestProps): Promise<Request> {
    const result = await createRequest({
      userId: this.user.id,
      content: props.content,
      requesterUserId: this.context.clientUser.id
    });
    return buildRequest(this.context, result);
  }

  public async addProfile(props: AddProfileProps) {
    const result = await createProfile({
      userId: this.user.id,
      authorUserId: this.user.id,
      content: props.content
    });
    return buildProfile(this.context, result);
  }

  public async getProfiles(): Promise<Profile[]> {
    const results = await getAllProfiles(this.user.id);
    return results.map((result) => buildProfile(this.context, result));
  }
}
