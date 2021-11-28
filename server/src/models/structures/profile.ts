import { User } from "./user";
import { Context, ContextModel } from "../context";
import { ProfileService } from "~/models/structures/services/profile-service";

export class Profile extends ContextModel implements ProfileIdentifier, Partial<ProfileProps> {
  private readonly service = new ProfileService(this);
  public readonly id: string;
  public readonly target: User;
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
    await this.service.fetch();
  }

  public async delete() {
    await this.service.delete();
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
