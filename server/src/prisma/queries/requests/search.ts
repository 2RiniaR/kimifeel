import { prisma } from "../../client";
import { RequestQueryResult } from "../results";

type Props = {
  order: "latest" | "oldest";
  start: number;
  count: number;
  content?: string;
  targetUserId?: string;
  applicantUserId?: string;
};

export async function searchRequests({
  order,
  start,
  count,
  targetUserId,
  applicantUserId
}: Props): Promise<RequestQueryResult[]> {
  return await prisma.request.findMany({
    where: {
      targetUserId,
      applicantUserId
    },
    orderBy: {
      createdAt: order === "latest" ? "desc" : "asc"
    },
    skip: start,
    take: count,
    include: {
      applicantUser: true,
      targetUser: true
    }
  });
}
