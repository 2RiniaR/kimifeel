import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConnectionError, DiscordIdDuplicatedError } from "../../error";

type Props = {
  discordId: string;
};

export async function createUser({ discordId }: Props): Promise<UserQueryResult> {
  try {
    return await prisma.user.create({
      data: {
        discordId
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new DiscordIdDuplicatedError();
    }
    throw error;
  }
}
