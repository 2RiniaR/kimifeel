import { prisma } from "../../client";
import { UserQueryResult } from "../results";

export async function findUserById(id: string): Promise<UserQueryResult | undefined> {
  const result = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return result ?? undefined;
}

export async function findUserByDiscordId(discordId: string): Promise<UserQueryResult | undefined> {
  const result = await prisma.user.findUnique({
    where: {
      discordId
    }
  });
  return result ?? undefined;
}
