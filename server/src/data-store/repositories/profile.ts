import { prisma, withConvertPrismaErrors } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { getRandomIntegerArray } from "../../helpers/random";
import { Awaited } from "../../helpers/types";

export type RawProfile = NonNullable<Awaited<ReturnType<typeof profileQuerySample>>>;
function profileQuerySample() {
  return prisma.profile.findFirst({
    include: {
      authorUser: { select: { id: true, discordId: true, enableMention: true } },
      ownerUser: { select: { id: true, discordId: true, enableMention: true } }
    }
  });
}

export type ProfileUniqueField = { readonly id: string } | { readonly index: number };

type ProfileUniqueCondition = {
  readonly id?: string;
  readonly index?: number;
};

type CreateProps = {
  readonly ownerUserId: string;
  readonly authorUserId: string;
  readonly content: string;
};

export type CountCondition = {
  readonly authorUserId?: string;
  readonly ownerUserId?: string;
};

type RandomProps = {
  readonly count: number;
  readonly content?: string;
  readonly ownerUserId?: string;
  readonly authorUserId?: string;
};

type SearchProps = {
  readonly order: "latest" | "oldest";
  readonly start: number;
  readonly count: number;
  readonly content?: string;
  readonly ownerUserId?: string;
  readonly authorUserId?: string;
};

function toUniqueCondition(field: ProfileUniqueField): ProfileUniqueCondition {
  return {
    id: "id" in field ? field.id : undefined,
    index: "index" in field ? field.index : undefined
  };
}

export class ProfileRepository {
  async find(unique: ProfileUniqueField): Promise<RawProfile | undefined> {
    const result = await withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.findUnique({
        where: toUniqueCondition(unique),
        include: { authorUser: true, ownerUser: true }
      })
    );
    return result ?? undefined;
  }

  async search({ order, start, count, ownerUserId, authorUserId, content }: SearchProps): Promise<RawProfile[]> {
    return withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.findMany({
        where: { ownerUserId, authorUserId, content: { contains: content } },
        orderBy: { createdAt: order === "latest" ? "desc" : "asc" },
        skip: start,
        take: count,
        include: { authorUser: true, ownerUser: true }
      })
    );
  }

  async getRandom({ count, ownerUserId, authorUserId, content }: RandomProps): Promise<RawProfile[]> {
    const resultsId = await withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.findMany({
        select: { id: true },
        where: { ownerUserId, authorUserId, content: { contains: content } }
      })
    );

    const selectsId = getRandomIntegerArray(0, resultsId.length, count).map((v) => resultsId[v].id);
    return withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.findMany({
        where: { id: { in: selectsId } },
        include: { authorUser: true, ownerUser: true }
      })
    );
  }

  async count({ authorUserId, ownerUserId }: CountCondition): Promise<number> {
    return withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.count({ where: { authorUserId, ownerUserId } })
    );
  }

  async create({ ownerUserId, authorUserId, content }: CreateProps): Promise<RawProfile> {
    return withConvertPrismaErrors.invokeAsync(async () =>
      prisma.profile.create({
        data: { ownerUserId, authorUserId, content },
        include: { authorUser: true, ownerUser: true }
      })
    );
  }

  async delete(unique: ProfileUniqueField): Promise<RawProfile | undefined> {
    return withConvertPrismaErrors.invokeAsync(async () => {
      try {
        return prisma.profile.delete({
          where: toUniqueCondition(unique),
          include: { authorUser: true, ownerUser: true }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return undefined;
        throw error;
      }
    });
  }
}
