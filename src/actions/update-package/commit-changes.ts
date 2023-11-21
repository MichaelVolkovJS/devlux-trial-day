import axios, { AxiosError } from "axios";
import { API_BASE_URL, bitBucketAuth } from "./consts";
import { CommitBody } from "./types";
import { handleError } from "../../utils/handle-error";

/**
 * This function commit the new `package.json` file to new brach
 * @param {{message: string, [key: string]: object, branch: string }} commitBody
 * @param {string} repoName
 */
export const commitChanges = async (
  commitBody: CommitBody,
  repoName: string
) => {
  try {
    console.info("Commiting the changes...");
    await axios.post(`${API_BASE_URL}/${repoName}/src/`, commitBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: bitBucketAuth,
    });
  } catch (error) {
    handleError(error as AxiosError);
  }
};
