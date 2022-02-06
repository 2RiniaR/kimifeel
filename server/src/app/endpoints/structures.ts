export type ProfileSpecifier = { id: string } | { index: number };
export type RequestSpecifier = { id: string } | { index: number };
export type UserSpecifier = { id: string } | { discordId: string };

export type RequestBody = {
  index: number;
  content: string;
  requester: UserBody;
  target: UserBody;
};

export type ProfileBody = {
  index: number;
  content: string;
  owner: UserBody;
  author: UserBody;
};

export type UserBody = {
  id: string;
  discordId: string;
  enableMention: boolean;
};

export type UserStatsBody = UserBody & {
  ownedProfileCount: number;
  selfProfileCount: number;
  writtenProfileCount: number;
};

export type CreateRequestParams = {
  target: UserSpecifier;
  content: string;
};

export type RequestCondition = {
  content?: string;
  target?: UserSpecifier;
  applicant?: UserSpecifier;
};

export type SearchRequestParams = RequestCondition &
  ContentsIndex & {
    status: "sent" | "received";
  };

export type CreateProfileParams = {
  content: string;
};

export type ProfileCondition = {
  owner?: UserSpecifier;
  author?: UserSpecifier;
  content?: string;
};

export type ContentsIndex = {
  order: "oldest" | "latest";
  page: number;
};

export type SearchProfileParams = ProfileCondition & ContentsIndex;
