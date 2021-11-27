import { SystemMessageEmbed, SystemMessageType } from "~/discord/views/system-message-embed";

export type ErrorEmbedProps = {
  type: SystemMessageType;
  error: unknown;
};

export class ErrorEmbed extends SystemMessageEmbed {
  constructor(props: ErrorEmbedProps) {
    super({
      type: props.type,
      message: props.error instanceof Error ? props.error.message : "不明なエラーが発生しました。"
    });
  }
}
