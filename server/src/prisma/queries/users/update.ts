import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

type Props = {
  enableMention: boolean;
};

export async function updateUser(id: string, { enableMention }: Props): Promise<UserQueryResult | undefined> {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        enableMention
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") {
      return undefined;
    }
    throw error;
  }
}
