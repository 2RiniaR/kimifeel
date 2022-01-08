import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

type Props = {
  discordId: string;
};

export class DiscordIdDuplicatedError extends Error {}

export async function createUser({ discordId }: Props): Promise<UserQueryResult> {
  try {
    return await prisma.user.create({
      data: {
        discordId
      }
    });
  } catch (error) {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }

    switch (error.code) {
      case "P2002":
        throw new DiscordIdDuplicatedError();
    }

    throw error;
  }
}
