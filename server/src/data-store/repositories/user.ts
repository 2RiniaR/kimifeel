import { DiscordIdDuplicatedError, prisma, withConvertPrismaErrors } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Awaited } from "../../helpers/types";

export type RawUser = NonNullable<Awaited<ReturnType<typeof userQuerySample>>>;
function userQuerySample() {
  return prisma.user.findFirst();
}

export type UserUniqueField = { readonly id: string } | { readonly discordId: string };
type UserUniqueCondition = {
  readonly id?: string;
  readonly discordId?: string;
};

type CreateProps = {
  readonly discordId: string;
};

type UpdateProps = {
  readonly enableMention?: boolean;
};

function toUniqueCondition(field: UserUniqueField): UserUniqueCondition {
  return {
    id: "id" in field ? field.id : undefined,
    discordId: "discordId" in field ? field.discordId : undefined
  };
}

export class UserRepository {
  async find(unique: UserUniqueField): Promise<RawUser | undefined> {
    const result = await withConvertPrismaErrors.invoke(() =>
      prisma.user.findUnique({ where: toUniqueCondition(unique) })
    );
    return result ?? undefined;
  }

  async update(id: string, { enableMention }: UpdateProps): Promise<RawUser | undefined> {
    return await withConvertPrismaErrors.invoke(() => {
      try {
        return prisma.user.update({
          where: { id },
          data: { enableMention }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return Promise.resolve(undefined);
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

    const result = await withConvertPrismaErrors.invoke(() =>
      prisma.user.findMany({
        where: { OR: [{ id: { in: idEntries } }, { discordId: { in: discordIdEntries } }] }
      })
    );
    return result ?? undefined;
  }

  async create({ discordId }: CreateProps): Promise<RawUser> {
    return withConvertPrismaErrors
      .guard((error) => {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
          throw new DiscordIdDuplicatedError();
        }
      })
      .invoke(() => prisma.user.create({ data: { discordId } }));
  }

  async delete(unique: UserUniqueField): Promise<RawUser | undefined> {
    return withConvertPrismaErrors.invoke(async () => {
      try {
        return prisma.user.delete({ where: toUniqueCondition(unique) });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return undefined;
        throw error;
      }
    });
  }
}
