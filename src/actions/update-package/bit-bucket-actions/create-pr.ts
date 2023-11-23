import axios, { AxiosError } from "axios";
import { handleError } from "../../../utils/handle-error";
import { API_BASE_URL, bitBucketAuth } from "../consts";
import { PullRequestBody } from "../types";

/**
 * This function create the PR from the new branch with updated `package.json`
 * @param {object} pullRequestBody
 * @param {string} repoName
 */
export const createPullRequest = async (
  pullRequestBody: PullRequestBody,
  repoName: string
) => {
  try {
    console.info("Creating Pull Request...");
    await axios.post(
      `${API_BASE_URL}/${repoName}/pullrequests`,
      pullRequestBody,
      {
        auth: bitBucketAuth,
      }
    );
  } catch (error) {
    handleError(error as AxiosError);
  }
};
