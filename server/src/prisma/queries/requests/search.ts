import { prisma } from "../../client";
import { RequestQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

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
  content,
  targetUserId,
  applicantUserId
}: Props): Promise<RequestQueryResult[]> {
  try {
    return await prisma.request.findMany({
      where: {
        targetUserId,
        applicantUserId,
        content: {
          contains: content
        }
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
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
