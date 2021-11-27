import { User } from "./user";
import { ContextModel } from "../context/context-model";
import { Context } from "~/models/context/context";
import { NotFoundError } from "~/models/errors/not-found-error";
import { ForbiddenError } from "~/models/errors/forbidden-error";

export class Request extends ContextModel implements RequestIdentifier, Partial<RequestProps> {
  public target: User;
  public id: string;
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
    const clone = await this.repositories.requests.getById(this.target.id, this.id);
    if (!clone) throw new NotFoundError();
    this.setProps(clone);
  }

  public async accept() {
    if (!this.requester || !this.content) await this.fetch();
    if (!this.requester || !this.content) throw Error();

    if (this.context.clientUser.id !== this.target.id) throw new ForbiddenError();
    await this.repositories.requests.delete(this);
    await this.repositories.profiles.create({
      content: this.content,
      author: this.requester,
      target: this.target
    });
  }

  public async deny() {
    if (this.context.clientUser.id !== this.target.id) throw new ForbiddenError();
    await this.repositories.requests.delete(this);
  }

  public async cancel() {
    if (!this.requester) await this.fetch();
    if (!this.requester) throw Error();

    if (this.context.clientUser.id !== this.requester.id) throw new ForbiddenError();
    await this.repositories.requests.delete(this);
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
