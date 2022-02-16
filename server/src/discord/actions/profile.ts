import * as Auth from "auth";
import * as App from "app";
import { toProfile } from "./converters";
import { Communicator } from "./communicator";
import { Profile, SystemMessage } from "../structures";
import { authorize } from "./auth";
import { ErrorAction, withConvertAppErrors } from "./errors";

export interface ProfileMessageGenerator {
  created(profile: Profile): SystemMessage;
  deleted(profile: Profile): SystemMessage;
  list(profiles: Profile[]): SystemMessage;
}

export type CreateProfileProps = {
  readonly content: string;
};

export type DeleteProfileProps = {
  readonly index: number;
};

export type RandomProfileProps = {
  readonly ownerId?: string;
  readonly authorId?: string;
  readonly content?: string;
};

export type SearchProfileProps = {
  readonly order: "oldest" | "latest";
  readonly page: number;
  readonly ownerId?: string;
  readonly authorId?: string;
  readonly content?: string;
};

export type ShowProfileProps = {
  readonly index: number;
};

export class ProfileAction {
  constructor(
    private readonly authEndpoint: Auth.AuthEndpoint,
    private readonly profileEndpoint: App.ProfileEndpoint,
    private readonly messageGenerator: ProfileMessageGenerator,
    private readonly errorAction: ErrorAction
  ) {}

  public async create(communicator: Communicator<CreateProfileProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.profileEndpoint.create(id, { content: props.content })
      );

      const profile = toProfile(result);
      const replyMessage = this.messageGenerator.created(profile);
      await communicator.reply(replyMessage, { mentions: [profile.owner] });
    });
  }

  public async delete(communicator: Communicator<DeleteProfileProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.profileEndpoint.delete(id, { index: props.index })
      );

      const profile = toProfile(result);
      const replyMessage = this.messageGenerator.deleted(profile);
      await communicator.reply(replyMessage, { mentions: [profile.owner], showOnlySender: true });
    });
  }

  public async random(communicator: Communicator<RandomProfileProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.profileEndpoint.random(id, {
          owner: props.ownerId !== undefined ? { discordId: props.ownerId } : undefined,
          author: props.authorId !== undefined ? { discordId: props.authorId } : undefined,
          content: props.content
        })
      );
      const profiles = result.map((e) => toProfile(e));

      const replyMessage = this.messageGenerator.list(profiles);
      await communicator.reply(replyMessage);
    });
  }

  public async search(communicator: Communicator<SearchProfileProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.profileEndpoint.search(id, {
          owner: props.ownerId !== undefined ? { discordId: props.ownerId } : undefined,
          author: props.authorId !== undefined ? { discordId: props.authorId } : undefined,
          content: props.content,
          page: props.page,
          order: props.order
        })
      );
      const profiles = result.map((e) => toProfile(e));

      const replyMessage = this.messageGenerator.list(profiles);
      await communicator.reply(replyMessage);
    });
  }

  public async show(communicator: Communicator<ShowProfileProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.profileEndpoint.find(id, { index: props.index })
      );
      const profile = toProfile(result);

      const replyMessage = this.messageGenerator.list([profile]);
      await communicator.reply(replyMessage);
    });
  }
}
