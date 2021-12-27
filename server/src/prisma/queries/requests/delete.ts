import { prisma } from "../../client";
import { RequestQueryResult } from "../results";

export async function deleteRequestByIndex(index: number): Promise<RequestQueryResult | undefined> {
  try {
    return prisma.request.delete({
      where: {
        index: index
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
