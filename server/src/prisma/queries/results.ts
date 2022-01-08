import { prisma } from "../client";
import { Awaited } from "helpers/types";

export type UserQueryResult = NonNullable<Awaited<ReturnType<typeof userQuerySample>>>;
function userQuerySample() {
  return prisma.user.findFirst();
}

export type ProfileQueryResult = NonNullable<Awaited<ReturnType<typeof profileQuerySample>>>;
function profileQuerySample() {
  return prisma.profile.findFirst({
    include: {
      authorUser: {
        select: {
          id: true,
          discordId: true
        }
      },
      ownerUser: {
        select: {
          id: true,
          discordId: true
        }
      }
    }
  });
}

export type RequestQueryResult = NonNullable<Awaited<ReturnType<typeof requestQuerySample>>>;
function requestQuerySample() {
  return prisma.request.findFirst({
    include: {
      applicantUser: {
        select: {
          id: true,
          discordId: true
        }
      },
      targetUser: {
        select: {
          id: true,
          discordId: true
        }
      }
    }
  });
}
