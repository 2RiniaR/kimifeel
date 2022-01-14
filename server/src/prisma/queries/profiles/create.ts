import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

type Props = {
  ownerUserId: string;
  authorUserId: string;
  content: string;
};

export async function createProfile({ ownerUserId, authorUserId, content }: Props): Promise<ProfileQueryResult> {
  try {
    return prisma.profile.create({
      data: {
        ownerUserId,
        authorUserId,
        content
      },
      include: {
        authorUser: true,
        ownerUser: true
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
