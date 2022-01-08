import { prisma } from "../../client";
import { RequestQueryResult } from "../results";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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
