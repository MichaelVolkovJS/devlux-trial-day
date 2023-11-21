export type BitBucketAuth = {
  username: string;
  password: string;
};

export type CommitBody = {
  message: string;
  branch: string;
  "package.json": string;
};

export type BranchType = {
  branch: {
    name: string;
  };
};

export type PullRequestBody = {
  title: string;
  source: BranchType;
  destination: BranchType;
};
