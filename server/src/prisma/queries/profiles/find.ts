import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";

export async function findProfileByIndex(index: number): Promise<ProfileQueryResult | undefined> {
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
}

export async function findAllProfiles(ownerUserId: string): Promise<ProfileQueryResult[]> {
  return await prisma.profile.findMany({
    where: {
      ownerUserId
    },
    include: {
      authorUser: true,
      ownerUser: true
    }
  });
}
