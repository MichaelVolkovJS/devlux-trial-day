import { BitBucketAuth } from "./types";

export const BITBUCKET_USERNAME = process.env.BITBUCKET_USERNAME || "";
export const BITBUCKET_PASSWORD = process.env.BITBUCKET_PASSWORD || "";
export const API_BASE_URL = process.env.API_BASE_URL || "";

export const bitBucketAuth: BitBucketAuth = {
  username: BITBUCKET_USERNAME,
  password: BITBUCKET_PASSWORD,
};
