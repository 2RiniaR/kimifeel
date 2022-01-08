export type ProfileIdentifier = { id: string } | { index: number };
export type RequestIdentifier = { id: string } | { index: number };
export type UserIdentifier = { id: string } | { discordId: string };

export type RequestResult = {
  index: number;
  content: string;
  requesterUserId: string;
  targetUserId: string;
};

export type ProfileResult = {
  index: number;
  content: string;
  ownerUserId: string;
  authorUserId: string;
};
