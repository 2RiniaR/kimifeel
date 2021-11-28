import { User } from "./user";
import { Context, ContextModel } from "../context";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { RequestService } from "~/models/structures/services/request-service";

export class Request extends ContextModel implements RequestIdentifier, Partial<RequestProps> {
  private readonly service = new RequestService(this);
  public readonly target: User;
  public readonly id: string;
  public content?: string;
  public requester?: User;
  public index?: number;

  public constructor(ctx: Context, props: RequestIdentifier & Partial<RequestProps>) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
    this.setProps(props);
  }

  public setProps(props: Partial<RequestProps>) {
    this.content = props.content;
    this.requester = props.requester;
    this.index = props.index;
  }

  public async fetch() {
    await this.service.fetch();
  }

  public async accept() {
    if (this.context.clientUser.id !== this.target.id) throw new ForbiddenError();
    await this.service.delete();
    return await this.service.createProfile();
  }

  public async deny() {
    if (this.context.clientUser.id !== this.target.id) throw new ForbiddenError();
    await this.service.delete();
  }

  public async cancel() {
    if (!this.requester) await this.fetch();
    if (!this.requester) throw Error();
    if (this.context.clientUser.id !== this.requester.id) throw new ForbiddenError();
    await this.service.delete();
  }
}

export type RequestIdentifier = {
  id: string;
  target: User;
};

export type RequestProps = {
  content: string;
  requester: User;
  index: number;
};
