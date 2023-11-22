import { handleError } from "../../utils/handle-error";
import { CommitBody } from "./types";
import { createBranch } from "./create-branch";
import { getCurrentPackageJson } from "./get-current-package-json";
import { commitChanges } from "./commit-changes";
import { createPullRequest } from "./create-pr";
import { updatePackageJson } from "./update-package-json";
import { getMainBranch } from "./get-main-branch";

/**
 * This method contains the steps for update the `package.json` file and
 * create the PR
 * !! This method gets the params automatically from `process.argv`
 * @param {string} repoName
 * @param {string} packageName
 * @param {string} packageVersion
 */
export async function updatePackageAndOpenPR(
  repoName: string,
  packageName: string,
  packageVersion: string
) {
  try {
    const mainBranchName = await getMainBranch(repoName);

    const currentPackageJson: any = await getCurrentPackageJson(
      repoName,
      mainBranchName
    );

    const packageJson = currentPackageJson.data;
    // update and compare package.json files
    const updatedPackageJson = updatePackageJson(
      packageJson,
      packageName,
      packageVersion
    );

    const newBranchName = `update-${packageName}-to-${packageVersion}`;
    await createBranch(mainBranchName, repoName, newBranchName);

    const commitBody: CommitBody = {
      message: `Update ${packageName} to version ${packageVersion}`,
      "package.json": updatedPackageJson,
      branch: newBranchName,
    };
    await commitChanges(commitBody, repoName);

    const pullRequestBody = {
      title: `Update ${packageName} to version ${packageVersion}`,
      source: { branch: { name: newBranchName } },
      destination: { branch: { name: mainBranchName } },
    };
    await createPullRequest(pullRequestBody, repoName);

    console.log("PR opened!");
  } catch (error) {
    handleError(error as Error);
  }
}
