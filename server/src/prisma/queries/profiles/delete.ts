import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";

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
    return;
  }
}
