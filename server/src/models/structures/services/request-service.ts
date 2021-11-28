import { NotFoundError } from "~/models/errors/not-found-error";
import { deleteRequest, getRequestById } from "~/models/repositories/queries/request";
import { buildRequest } from "~/models/repositories/builders/request";
import { createProfile } from "~/models/repositories/queries/profile";
import { buildProfile } from "~/models/repositories/builders/profile";
import { ContextModel } from "~/models/context";
import { Request } from "~/models/structures/request";

export class RequestService extends ContextModel {
  private readonly request: Request;

  public constructor(request: Request) {
    super(request.context);
    this.request = request;
  }

  public async fetch() {
    const result = await getRequestById(this.request.target.id, this.request.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    const request = buildRequest(this.context, result);
    this.request.setProps(request);
  }

  public async createProfile() {
    if (!this.request.requester || !this.request.content) await this.fetch();
    if (!this.request.requester || !this.request.content) {
      throw Error("Data was not fetched successfully.");
    }
    const result = await createProfile({
      content: this.request.content,
      authorUserId: this.request.requester.id,
      userId: this.request.target.id
    });
    return buildProfile(this.context, result);
  }

  public async delete() {
    await deleteRequest(this.context.clientUser.id, this.request.id);
  }
}
