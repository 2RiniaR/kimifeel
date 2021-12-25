import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";

export async function deleteProfile(ownerUserId: string, index: number): Promise<ProfileQueryResult | undefined> {
  try {
    return prisma.profile.delete({
      where: {
        ownerUserId_index: {
          ownerUserId,
          index
        }
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
