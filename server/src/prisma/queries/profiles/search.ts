import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";

type Props = {
  order: "latest" | "oldest";
  start: number;
  count: number;
  content?: string;
  ownerUserId?: string;
  authorUserId?: string;
};

export async function searchProfiles({
  order,
  start,
  count,
  ownerUserId,
  authorUserId,
  content
}: Props): Promise<ProfileQueryResult[]> {
  return await prisma.profile.findMany({
    where: {
      ownerUserId,
      authorUserId,
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
      authorUser: true,
      ownerUser: true
    }
  });
}
