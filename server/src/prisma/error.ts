import { PrismaClientInitializationError } from "@prisma/client/runtime";

export class ConnectionError extends Error {}
export class DiscordIdDuplicatedError extends Error {}

export function withHandlePrismaErrors<TReturn>(inner: () => TReturn) {
  try {
    return inner();
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) throw new ConnectionError();
    throw error;
  }
}
