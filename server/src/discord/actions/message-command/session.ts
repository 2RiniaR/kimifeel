import { CommandFormatOn, CommandResultOf, interpretCommand } from "command-parser";
import { parameterTypes } from "./types";
import { ActionWith, EndpointParamsOf, EndpointResultOf, EventContextOf } from "../base";
import { AnyEndpoint, Endpoint } from "endpoints";
import { MessageCommandEvent } from "discord/events";
import { SessionIn } from "../session";

export type MessageCommandFormat = CommandFormatOn<typeof parameterTypes>;
export type MessageCommandResult<TFormat extends MessageCommandFormat> = CommandResultOf<
  typeof parameterTypes,
  TFormat
>;

export abstract class MessageCommandSession<
  TAction extends ActionWith<MessageCommandEvent, AnyEndpoint>,
  TFormat extends MessageCommandFormat
> extends SessionIn<TAction> {
  command: MessageCommandResult<TFormat>;

  public constructor(
    context: EventContextOf<TAction>,
    endpoint: Endpoint<EndpointParamsOf<TAction>, EndpointResultOf<TAction>>,
    format: TFormat
  ) {
    super(context, endpoint);
    this.command = interpretCommand(context.command, format, parameterTypes);
  }
}
