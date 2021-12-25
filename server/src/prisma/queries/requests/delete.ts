import { prisma } from "../../client";
import { RequestQueryResult } from "../results";

export async function deleteRequest(targetUserId: string, index: number): Promise<RequestQueryResult | undefined> {
  try {
    return prisma.request.delete({
      where: {
        targetUserId_index: {
          targetUserId,
          index
        }
      },
      include: {
        applicantUser: true,
        targetUser: true
      }
    });
  } catch (error) {
    return;
  }
}
