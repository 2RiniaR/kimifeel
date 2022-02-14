export type ProfileSpecifier = {
  readonly id?: string;
  readonly index?: number;
};

export type RequestSpecifier = {
  readonly id?: string;
  readonly index?: number;
};

export type UserSpecifier = {
  readonly id?: string;
  readonly discordId?: string;
};

export type RequestBody = {
  readonly index: number;
  readonly content: string;
  readonly applicant: UserBody;
  readonly target: UserBody;
};

export type ProfileBody = {
  readonly index: number;
  readonly content: string;
  readonly owner: UserBody;
  readonly author: UserBody;
};

export type UserBody = {
  readonly id: string;
  readonly discordId: string;
  readonly enableMention: boolean;
};

export type UserStatsBody = UserBody & {
  readonly ownedProfileCount: number;
  readonly selfProfileCount: number;
  readonly writtenProfileCount: number;
};

export type UserConfigParams = {
  readonly enableMention?: boolean;
};

export type CreateRequestParams = {
  readonly target: UserSpecifier;
  readonly content: string;
};

export type RequestCondition = {
  readonly content?: string;
  readonly target?: UserSpecifier;
  readonly applicant?: UserSpecifier;
};

export type SearchRequestParams = RequestCondition &
  ContentsIndex & {
    readonly status: "sent" | "received";
  };

export type CreateProfileParams = {
  readonly content: string;
};

export type ProfileCondition = {
  readonly owner?: UserSpecifier;
  readonly author?: UserSpecifier;
  readonly content?: string;
};

export type ContentsIndex = {
  readonly order: "oldest" | "latest";
  readonly page: number;
};

export type SearchProfileParams = ProfileCondition & ContentsIndex;
