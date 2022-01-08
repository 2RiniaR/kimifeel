import { prisma } from "../../client";
import { getRandomIntegerArray } from "helpers/random";
import { ProfileQueryResult } from "../results";

type Props = {
  count: number;
  content?: string;
  ownerUserId?: string;
  authorUserId?: string;
};

export async function randomProfiles({
  count,
  ownerUserId,
  authorUserId,
  content
}: Props): Promise<ProfileQueryResult[]> {
  const resultsId = await prisma.profile.findMany({
    select: {
      id: true
    },
    where: {
      ownerUserId,
      authorUserId,
      content: {
        contains: content
      }
    }
  });

  const selectsId = getRandomIntegerArray(0, resultsId.length, count).map((v) => resultsId[v].id);

  return await prisma.profile.findMany({
    where: {
      id: {
        in: selectsId
      }
    },
    include: {
      authorUser: true,
      ownerUser: true
    }
  });
}
