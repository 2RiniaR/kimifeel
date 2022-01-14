import { prisma } from "../../client";
import { RequestQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

type Props = {
  applicantUserId: string;
  targetUserId: string;
  content: string;
};

export async function createRequest({ applicantUserId, targetUserId, content }: Props): Promise<RequestQueryResult> {
  try {
    return prisma.request.create({
      data: {
        applicantUserId,
        targetUserId,
        content
      },
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
