import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

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
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") {
      return undefined;
    }
    throw error;
  }
}
