import { prisma } from "../../client";
import { RequestQueryResult } from "../results";

type Props = {
  applicantUserId: string;
  targetUserId: string;
  content: string;
};

export async function createRequest({ applicantUserId, targetUserId, content }: Props): Promise<RequestQueryResult> {
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
}
