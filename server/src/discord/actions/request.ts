import * as Auth from "auth";
import * as App from "app";
import { toProfile, toRequest } from "./converters";
import { Communicator } from "./communicator";
import { Profile, Request, SystemMessage } from "../structures";
import { authorize } from "./auth";
import { ErrorAction, withConvertAppErrors } from "./errors";

export interface RequestMessageGenerator {
  accepted(profile: Profile): SystemMessage;
  canceled(request: Request): SystemMessage;
  denied(request: Request): SystemMessage;
  sent(request: Request): SystemMessage;
  list(requests: Request[]): SystemMessage;
}

export type AcceptRequestProps = {
  readonly index: number;
};

export type CancelRequestProps = {
  readonly index: number;
};

export type DenyRequestProps = {
  readonly index: number;
};

export type SendRequestProps = {
  readonly targetId: string;
  readonly content: string;
};

export type SearchRequestProps = {
  readonly status: "sent" | "received";
  readonly order: "oldest" | "latest";
  readonly page: number;
  readonly targetId?: string;
  readonly applicantId?: string;
  readonly content?: string;
};

export type ShowRequestProps = {
  readonly index: number;
};

export class RequestAction {
  constructor(
    private readonly authEndpoint: Auth.AuthEndpoint,
    private readonly requestEndpoint: App.RequestEndpoint,
    private readonly messageGenerator: RequestMessageGenerator,
    private readonly errorAction: ErrorAction
  ) {}

  public async accept(communicator: Communicator<AcceptRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.accept(id, { index: props.index })
      );

      const profile = toProfile(result);
      const replyMessage = this.messageGenerator.accepted(profile);
      await communicator.reply(replyMessage, { mentions: [profile.author, profile.owner] });
    });
  }

  public async cancel(communicator: Communicator<CancelRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.cancel(id, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.canceled(request);
      await communicator.reply(replyMessage);
    });
  }

  public async deny(communicator: Communicator<DenyRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.deny(id, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.denied(request);
      await communicator.reply(replyMessage, { mentions: [request.applicant, request.target], showOnlySender: true });
    });
  }

  public async send(communicator: Communicator<SendRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.create(id, {
          target: { discordId: props.targetId },
          content: props.content
        })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.sent(request);
      await communicator.reply(replyMessage, {
        mentions: [request.applicant, request.target],
        reactions: ["✅", "⛔", "❌"]
      });
    });
  }

  public async search(communicator: Communicator<SearchRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.search(id, {
          status: props.status,
          order: props.order,
          page: props.page,
          target: props.targetId !== undefined ? { discordId: props.targetId } : undefined,
          applicant: props.applicantId !== undefined ? { discordId: props.applicantId } : undefined,
          content: props.content
        })
      );

      const requests = result.map((e) => toRequest(e));
      const replyMessage = this.messageGenerator.list(requests);
      await communicator.reply(replyMessage);
    });
  }

  public async show(communicator: Communicator<ShowRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.requestEndpoint.find(id, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.list([request]);
      await communicator.reply(replyMessage);
    });
  }
}
