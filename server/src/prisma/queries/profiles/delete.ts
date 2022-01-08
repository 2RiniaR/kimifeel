import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export async function deleteProfileByIndex(index: number): Promise<ProfileQueryResult | undefined> {
  try {
    return prisma.profile.delete({
      where: {
        index: index
      },
      include: {
        authorUser: true,
        ownerUser: true
      }
    });
  } catch (error) {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }

    switch (error.code) {
      case "P2016":
        return undefined;
    }

    throw error;
  }
}
