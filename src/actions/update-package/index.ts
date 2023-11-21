import "dotenv/config";
import { handleError } from "../../utils/handle-error";
import { CommitBody } from "./types";
import { createBranch } from "./create-branch";
import { getCurrentPackageJson } from "./get-current-package-json";
import { commitChanges } from "./commit-changes";
import { createPullRequest } from "./create-pr";

/**
 * This method contains the steps for update the `package.json` file and
 * create the PR
 * !! This method gets the params automatically from `process.argv`
 * @param {string} repoName
 * @param {string} packageName
 * @param {string} packageVersion
 */
async function updatePackageAndOpenPR(
  repoName: string,
  packageName: string,
  packageVersion: string
) {
  try {
    const newBranchName = `update-${packageName}-to-${packageVersion}`;

    await createBranch(repoName, newBranchName);

    const currentPackageJson: any = await getCurrentPackageJson(
      repoName,
      newBranchName
    );

    // update the package version
    const packageJson = currentPackageJson.data;

    // update and compare package.json files
    const originalPackageJson = JSON.stringify(packageJson, null, 2);
    packageJson.dependencies[packageName] = packageVersion;
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);

    if (originalPackageJson !== updatedPackageJson) {
      const commitBody: CommitBody = {
        message: `Update ${packageName} to version ${packageVersion}`,
        "package.json": updatedPackageJson,
        branch: newBranchName,
      };
      await commitChanges(commitBody, repoName);
    } else {
      throw Error("The new file is the same as the old one");
    }

    const pullRequestTitle = `Update ${packageName} to version ${packageVersion}`;
    await createPullRequest(newBranchName, pullRequestTitle, repoName);

    console.log("PR opened!");
  } catch (error) {
    handleError(error as Error);
  }
}

// How to use:
// node actions/update-package.js <repoName> <packageName> <packageVersion>
const [repoName, packageName, packageVersion] = process.argv.slice(2);

if (!repoName || !packageName || !packageVersion) {
  console.error(
    "Please provide the repository name, package name and package version"
  );
} else {
  updatePackageAndOpenPR(repoName, packageName, packageVersion);
}
