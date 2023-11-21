import axios, { AxiosError } from "axios";
import { handleError } from "../../utils/handle-error";
import { API_BASE_URL, bitBucketAuth } from "./consts";

/**
 * This function create the PR from the new branch with updated `package.json`
 * @param {string} title
 * @param {string} branchName
 * @param {string} repoName
 */
export const createPullRequest = async (
  branchName: string,
  title: string,
  repoName: string
) => {
  try {
    console.info("Creating Pull Request...");
    await axios.post(
      `${API_BASE_URL}/${repoName}/pullrequests`,
      {
        title,
        source: { branch: { name: branchName } },
        destination: { branch: { name: "master" } },
      },
      {
        auth: bitBucketAuth,
      }
    );
  } catch (error) {
    handleError(error as AxiosError);
  }
};
