import { prisma } from "../../client";
import { RequestQueryResult } from "../results";
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { ConnectionError } from "../../error";

export async function findRequest(id: string): Promise<RequestQueryResult | undefined> {
  try {
    const result = await prisma.request.findUnique({
      where: {
        id: id
      },
      include: {
        applicantUser: true,
        targetUser: true
      }
    });
    return result ?? undefined;
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}

export async function findRequestByIndex(index: number): Promise<RequestQueryResult | undefined> {
  try {
    const result = await prisma.request.findUnique({
      where: {
        index: index
      },
      include: {
        applicantUser: true,
        targetUser: true
      }
    });
    return result ?? undefined;
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      throw new ConnectionError();
    }
    throw error;
  }
}
