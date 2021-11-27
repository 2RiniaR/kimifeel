import { User } from "./user";
import { ContextModel } from "../context/context-model";
import { Context } from "~/models/context/context";
import { NotFoundError } from "~/models/errors/not-found-error";

export class Profile extends ContextModel implements ProfileIdentifier, Partial<ProfileProps> {
  public id: string;
  public target: User;
  public author?: User;
  public content?: string;
  public index?: number;

  public constructor(ctx: Context, props: ProfileIdentifier & Partial<ProfileProps>) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
    this.setProps(props);
  }

  public setProps(props: Partial<ProfileProps>) {
    this.author = props.author;
    this.content = props.content;
    this.index = props.index;
  }

  public async fetch() {
    const clone = await this.repositories.profiles.getById(this.target.id, this.id);
    if (!clone) throw new NotFoundError();
    this.setProps(clone);
  }

  public async delete() {
    await this.repositories.profiles.delete(this);
  }
}

export type ProfileIdentifier = {
  id: string;
  target: User;
};

export type ProfileProps = {
  content: string;
  author: User;
  index: number;
};
