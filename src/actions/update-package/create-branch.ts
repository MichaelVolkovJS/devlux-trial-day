import axios, { AxiosError } from "axios";
import { handleError } from "../../utils/handle-error";
import { API_BASE_URL, bitBucketAuth } from "./consts";

/**
 * This function just create the new branch
 * @param {string} repoName
 * @param {string} branchName
 */
export const createBranch = async (repoName: string, branchName: string) => {
  try {
    console.info("Creating new branch...");
    await axios.post(
      `${API_BASE_URL}/${repoName}/refs/branches`,
      {
        name: branchName,
        target: { hash: "master" },
      },
      { auth: bitBucketAuth }
    );
  } catch (error) {
    handleError(error as AxiosError);
  }
};
