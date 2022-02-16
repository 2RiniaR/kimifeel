export type SystemMessageType =
  | "none"
  | "succeed"
  | "deleted"
  | "profile"
  | "request"
  | "user"
  | "info"
  | "invalid"
  | "failed"
  | "warning"
  | "error";

export interface SystemMessage {
  type: SystemMessageType;
  title?: string;
  message?: string;
  fields?: {
    name: string;
    value: string;
    inline: boolean;
  }[];
}

export interface SystemMessageRead {
  title?: string;
  message?: string;
  fields?: {
    name: string;
    value: string;
    inline: boolean;
  }[];
}
