import { prisma } from "../../client";
import { UserQueryResult } from "../results";

export async function deleteUser(id: string): Promise<UserQueryResult | undefined> {
  try {
    return await prisma.user.delete({
      where: {
        id
      }
    });
  } catch (error) {
    return;
  }
}
