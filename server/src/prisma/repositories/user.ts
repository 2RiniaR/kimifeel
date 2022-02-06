import { DiscordIdDuplicatedError, prisma, withHandlePrismaErrors } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Awaited } from "../../helpers/types";

export type RawUser = NonNullable<Awaited<ReturnType<typeof userQuerySample>>>;
function userQuerySample() {
  return prisma.user.findFirst();
}

export type UserUniqueField = { id: string } | { discordId: string };
type UserUniqueCondition = {
  id?: string;
  discordId?: string;
};

function toUniqueCondition(field: UserUniqueField): UserUniqueCondition {
  return {
    id: "id" in field ? field.id : undefined,
    discordId: "discordId" in field ? field.discordId : undefined
  };
}

type CreateProps = {
  discordId: string;
};

type UpdateProps = {
  enableMention?: boolean;
};

export class UserRepository {
  async find(unique: UserUniqueField): Promise<RawUser | undefined> {
    const result = await withHandlePrismaErrors(() => prisma.user.findUnique({ where: toUniqueCondition(unique) }));
    return result ?? undefined;
  }

  async update(id: string, { enableMention }: UpdateProps): Promise<RawUser | undefined> {
    return await withHandlePrismaErrors(() => {
      try {
        return prisma.user.update({
          where: { id },
          data: { enableMention }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return undefined;
        throw error;
      }
    });
  }

  async findMany(uniques: UserUniqueField[]): Promise<RawUser[]> {
    const idEntries: string[] = [];
    const discordIdEntries: string[] = [];
    for (const unique of uniques) {
      if ("id" in unique) idEntries.push(unique.id);
      else discordIdEntries.push(unique.discordId);
    }

    const result = await withHandlePrismaErrors(() =>
      prisma.user.findMany({
        where: { OR: [{ id: { in: idEntries } }, { discordId: { in: discordIdEntries } }] }
      })
    );
    return result ?? undefined;
  }

  async create({ discordId }: CreateProps): Promise<RawUser> {
    return withHandlePrismaErrors(async () => {
      try {
        return await prisma.user.create({ data: { discordId } });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
          throw new DiscordIdDuplicatedError();
        }
        throw error;
      }
    });
  }

  async delete(unique: UserUniqueField): Promise<RawUser | undefined> {
    return withHandlePrismaErrors(async () => {
      try {
        return prisma.user.delete({ where: toUniqueCondition(unique) });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return undefined;
        throw error;
      }
    });
  }
}
