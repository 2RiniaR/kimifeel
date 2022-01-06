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
