import { prisma } from "../../client";
import { ProfileQueryResult } from "../results";

type Props = {
  ownerUserId: string;
  authorUserId: string;
  content: string;
};

export async function createProfile({ ownerUserId, authorUserId, content }: Props): Promise<ProfileQueryResult> {
  return prisma.profile.create({
    data: {
      ownerUserId,
      authorUserId,
      content
    },
    include: {
      authorUser: true,
      ownerUser: true
    }
  });
}
