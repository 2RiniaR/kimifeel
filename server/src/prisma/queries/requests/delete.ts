import { prisma } from "../../client";
import { RequestQueryResult } from "../results";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export async function deleteRequestByIndex(index: number): Promise<RequestQueryResult | undefined> {
  try {
    return prisma.request.delete({
      where: {
        index: index
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
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") {
      return undefined;
    }
    throw error;
  }
}
