import { prisma, withHandlePrismaErrors } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Awaited } from "../../helpers/types";

export type RawRequest = NonNullable<Awaited<ReturnType<typeof requestQuerySample>>>;
function requestQuerySample() {
  return prisma.request.findFirst({
    include: {
      applicantUser: { select: { id: true, discordId: true, enableMention: true } },
      targetUser: { select: { id: true, discordId: true, enableMention: true } }
    }
  });
}

export type RequestUniqueField = { id: string } | { index: number };
type RequestUniqueCondition = {
  id?: string;
  index?: number;
};

function toUniqueCondition(field: RequestUniqueField): RequestUniqueCondition {
  return {
    id: "id" in field ? field.id : undefined,
    index: "index" in field ? field.index : undefined
  };
}

type CreateProps = {
  applicantUserId: string;
  targetUserId: string;
  content: string;
};

type SearchProps = {
  order: "latest" | "oldest";
  start: number;
  count: number;
  content?: string;
  targetUserId?: string;
  applicantUserId?: string;
};

export class RequestRepository {
  async find(unique: RequestUniqueField): Promise<RawRequest | undefined> {
    const result = await withHandlePrismaErrors(async () =>
      prisma.request.findUnique({
        where: toUniqueCondition(unique),
        include: { applicantUser: true, targetUser: true }
      })
    );
    return result ?? undefined;
  }

  async search({ order, start, count, content, targetUserId, applicantUserId }: SearchProps): Promise<RawRequest[]> {
    return withHandlePrismaErrors(async () =>
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
    return withHandlePrismaErrors(async () =>
      prisma.request.create({
        data: { applicantUserId, targetUserId, content },
        include: { applicantUser: true, targetUser: true }
      })
    );
  }

  async delete(unique: RequestUniqueField): Promise<RawRequest | undefined> {
    return withHandlePrismaErrors(async () => {
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
