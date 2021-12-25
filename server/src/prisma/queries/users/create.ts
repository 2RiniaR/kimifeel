import { prisma } from "../../client";
import { UserQueryResult } from "../results";

type Props = {
  discordId: string;
};

export async function createUser({ discordId }: Props): Promise<UserQueryResult> {
  return await prisma.user.create({
    data: {
      discordId
    }
  });
}
