export type BitBucketAuth = {
  username: string;
  password: string;
};

export type CommitBody = {
  message: string;
  branch: string;
  "package.json": string;
};
