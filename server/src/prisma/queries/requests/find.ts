import { prisma } from "../../client";
import { RequestQueryResult } from "../results";

export async function findRequestByIndex(targetUserId: string, index: number): Promise<RequestQueryResult | undefined> {
  const result = await prisma.request.findUnique({
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
  return result ?? undefined;
}

export async function findAllRequests(targetUserId: string): Promise<RequestQueryResult[]> {
  return await prisma.request.findMany({
    where: {
      targetUserId
    },
    include: {
      applicantUser: true,
      targetUser: true
    }
  });
}
