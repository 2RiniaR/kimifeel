import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export async function findProfile(id: string): Promise<ProfileQueryResult | undefined> {
  try {
    const result = await prisma.profile.findUnique({
      where: {
        id: id
      },
      include: {
        authorUser: true,
        ownerUser: true
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

export async function findProfileByIndex(index: number): Promise<ProfileQueryResult | undefined> {
  try {
    const result = await prisma.profile.findUnique({
      where: {
        index: index
      },
      include: {
        authorUser: true,
        ownerUser: true
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
