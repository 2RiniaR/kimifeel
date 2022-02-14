import { prisma, withConvertPrismaErrors } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Awaited } from "helpers/types";

export type RawRequest = NonNullable<Awaited<ReturnType<typeof requestQuerySample>>>;
function requestQuerySample() {
  return prisma.request.findFirst({
    include: {
      applicantUser: { select: { id: true, discordId: true, enableMention: true } },
      targetUser: { select: { id: true, discordId: true, enableMention: true } }
    }
  });
}

export type RequestUniqueField = { readonly id: string } | { readonly index: number };
type RequestUniqueCondition = {
  readonly id?: string;
  readonly index?: number;
};

type CreateProps = {
  readonly applicantUserId: string;
  readonly targetUserId: string;
  readonly content: string;
};

type SearchProps = {
  readonly order: "latest" | "oldest";
  readonly start: number;
  readonly count: number;
  readonly content?: string;
  readonly targetUserId?: string;
  readonly applicantUserId?: string;
};

function toUniqueCondition(field: RequestUniqueField): RequestUniqueCondition {
  return {
    id: "id" in field ? field.id : undefined,
    index: "index" in field ? field.index : undefined
  };
}

export class RequestRepository {
  async find(unique: RequestUniqueField): Promise<RawRequest | undefined> {
    const result = await withConvertPrismaErrors.invoke(async () =>
      prisma.request.findUnique({
        where: toUniqueCondition(unique),
        include: { applicantUser: true, targetUser: true }
      })
    );
    return result ?? undefined;
  }

  async search({ order, start, count, content, targetUserId, applicantUserId }: SearchProps): Promise<RawRequest[]> {
    return withConvertPrismaErrors.invoke(async () =>
      prisma.request.findMany({
        where: { targetUserId, applicantUserId, content: { contains: content } },
        orderBy: { createdAt: order === "latest" ? "desc" : "asc" },
        skip: start,
        take: count,
        include: { applicantUser: true, targetUser: true }
      })
    );
  }

  async create({ applicantUserId, targetUserId, content }: CreateProps): Promise<RawRequest> {
    return withConvertPrismaErrors.invoke(async () =>
      prisma.request.create({
        data: { applicantUserId, targetUserId, content },
        include: { applicantUser: true, targetUser: true }
      })
    );
  }

  async delete(unique: RequestUniqueField): Promise<RawRequest | undefined> {
    return withConvertPrismaErrors.invoke(async () => {
      try {
        return prisma.request.delete({
          where: toUniqueCondition(unique),
          include: { applicantUser: true, targetUser: true }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2016") return undefined;
        throw error;
      }
    });
  }
}
