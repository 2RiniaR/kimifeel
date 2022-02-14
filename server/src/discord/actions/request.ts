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
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.accept(clientId, { index: props.index })
      );

      const profile = toProfile(result);
      const replyMessage = this.messageGenerator.accepted(profile);
      await communicator.reply(replyMessage, { mentions: [profile.author, profile.owner] });
    });
  }

  public async cancel(communicator: Communicator<CancelRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.cancel(clientId, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.canceled(request);
      await communicator.reply(replyMessage);
    });
  }

  public async deny(communicator: Communicator<DenyRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.deny(clientId, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.denied(request);
      await communicator.reply(replyMessage);
    });
  }

  public async send(communicator: Communicator<SendRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.create(clientId, {
          target: { discordId: props.targetId },
          content: props.content
        })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.sent(request);
      await communicator.reply(replyMessage, { reactions: ["✅", "⛔", "❌"] });
    });
  }

  public async search(communicator: Communicator<SearchRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.search(clientId, {
          status: props.status,
          order: props.order,
          page: props.page,
          target: { discordId: props.targetId },
          applicant: { discordId: props.applicantId },
          content: props.content
        })
      );

      const requests = result.map((e) => toRequest(e));
      const replyMessage = this.messageGenerator.list(requests);
      await communicator.reply(replyMessage);
    });
  }

  public async show(communicator: Communicator<ShowRequestProps>) {
    await this.errorAction.withErrorResponses(communicator).invoke(async () => {
      const props = communicator.getProps();

      const { clientId } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invoke(() =>
        this.requestEndpoint.find(clientId, { index: props.index })
      );

      const request = toRequest(result);
      const replyMessage = this.messageGenerator.list([request]);
      await communicator.reply(replyMessage);
    });
  }
}
