import axios, { AxiosError } from "axios";
import { API_BASE_URL, bitBucketAuth } from "./consts";
import { handleError } from "../../utils/handle-error";

/**
 * This function getting the current `package.json` file
 * @param {string} repoName
 * @param {string} branchName
 */
export const getCurrentPackageJson = async (
  repoName: string,
  branchName: string
) => {
  try {
    console.info("Getting current `package.json`...");
    return await axios.get(
      `${API_BASE_URL}/${repoName}/src/${branchName}/package.json`,
      { auth: bitBucketAuth }
    );
  } catch (error) {
    handleError(error as AxiosError);
  }
};
