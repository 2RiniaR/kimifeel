import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { emptyErrorPipeline } from "helpers/catch";

export class ConnectionError extends Error {
  public constructor() {
    super();
  }
}

export class DiscordIdDuplicatedError extends Error {
  public constructor() {
    super();
  }
}

export const withConvertPrismaErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof PrismaClientInitializationError) throw new ConnectionError();
});
