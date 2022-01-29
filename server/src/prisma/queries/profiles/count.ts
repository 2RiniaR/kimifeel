import { prisma } from "../../client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export type CountCondition = {
  authorUserId?: string;
  ownerUserId?: string;
};

export async function countProfile({ authorUserId, ownerUserId }: CountCondition): Promise<number> {
  try {
    return await prisma.profile.count({ where: { authorUserId, ownerUserId } });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
