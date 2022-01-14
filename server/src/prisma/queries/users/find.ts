import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export async function findUser(id: string): Promise<UserQueryResult | undefined> {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return result ?? undefined;
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}

export async function findUserByDiscordId(discordId: string): Promise<UserQueryResult | undefined> {
  try {
    const result = await prisma.user.findUnique({
      where: {
        discordId
      }
    });
    return result ?? undefined;
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
