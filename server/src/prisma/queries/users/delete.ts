import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export async function deleteUser(id: string): Promise<UserQueryResult | undefined> {
  try {
    return await prisma.user.delete({
      where: {
        id
      }
    });
  } catch (error) {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }

    switch (error.code) {
      case "P2016":
        return undefined;
    }

    throw error;
  }
}
