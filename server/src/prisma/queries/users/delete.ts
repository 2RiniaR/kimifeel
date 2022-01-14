import { prisma } from "../../client";
import { UserQueryResult } from "../results";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export async function deleteUser(id: string): Promise<UserQueryResult | undefined> {
  try {
    return await prisma.user.delete({
      where: {
        id
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
