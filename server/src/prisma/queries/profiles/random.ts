import { prisma } from "../../client";
import { getRandomIntegerArray } from "helpers/random";
import { ProfileQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

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
  let resultsId: { id: string }[];
  try {
    resultsId = await prisma.profile.findMany({
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
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }

  const selectsId = getRandomIntegerArray(0, resultsId.length, count).map((v) => resultsId[v].id);

  try {
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
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
