import axios, { AxiosError } from "axios";
import { handleError } from "../../../utils/handle-error";
import { API_BASE_URL, bitBucketAuth } from "../consts";

/**
 * This method get the main branch from workspace
 * @param {string} repoName
 */
export const getMainBranch = async (repoName: string) => {
  try {
    console.log("Getting the main branch name...");
    const response = await axios.get(`${API_BASE_URL}/${repoName}`, {
      auth: bitBucketAuth,
    });
    const repository = response.data;
    const defaultBranch = repository.mainbranch.name;
    return defaultBranch;
  } catch (error) {
    handleError(error as AxiosError);
  }
};
