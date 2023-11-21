require("dotenv").config();
const { post, get } = require("axios");
const { handleError } = require("../utils/handle-error");

const BITBUCKET_USERNAME = process.env.BITBUCKET_USERNAME;
const BITBUCKET_PASSWORD = process.env.BITBUCKET_PASSWORD;
const API_BASE_URL = process.env.API_BASE_URL;

const bitBucketAuth = {
  username: BITBUCKET_USERNAME,
  password: BITBUCKET_PASSWORD,
};

/**
 * This function just create the new branch
 * @param {string} repoName
 * @param {string} branchName
 */
const createBranch = async (repoName, branchName) => {
  try {
    console.info("Creating new branch...");
    await post(
      `${API_BASE_URL}/${repoName}/refs/branches`,
      {
        name: branchName,
        target: { hash: "master" },
      },
      { auth: bitBucketAuth }
    );
  } catch (error) {
    handleError(error);
  }
};

/**
 * This function getting the current `package.json` file
 * @param {string} repoName
 * @param {string} branchName
 */
const getCurrentPackageJson = async (repoName, branchName) => {
  try {
    console.info("Getting current `package.json`...");
    return await get(
      `${API_BASE_URL}/${repoName}/src/${branchName}/package.json`,
      { auth: bitBucketAuth }
    );
  } catch (error) {
    handleError(error);
  }
};

/**
 * This function commit the new `package.json` file to new brach
 * @param {{message: string, [key: string]: object, branch: string }} commitBody
 * @param {string} repoName
 */
const commitChanges = async (commitBody, repoName) => {
  try {
    console.info("Commiting the changes...");
    await post(`${API_BASE_URL}/${repoName}/src/`, commitBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: bitBucketAuth,
    });
  } catch (error) {
    handleError(error);
  }
};

/**
 * This function create the PR from the new branch with updated `package.json`
 * @param {string} title
 * @param {string} branchName
 * @param {string} repoName
 */
const createPullRequest = async (branchName, title, repoName) => {
  try {
    console.info("Creating Pull Request...");
    await post(
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
    handleError(error);
  }
};

/**
 * This method contains the steps for update the `package.json` file and
 * create the PR
 * !! This method gets the params automatically from `process.argv`
 * @param {string} repoName
 * @param {string} packageName
 * @param {string} packageVersion
 */
async function updatePackageAndOpenPR(repoName, packageName, packageVersion) {
  try {
    const newBranchName = `update-${packageName}-to-${packageVersion}`;

    await createBranch(repoName, newBranchName);

    const currentPackageJson = await getCurrentPackageJson(
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
      const commitBody = {
        message: `Update ${packageName} to version ${packageVersion}`,
        // TODO: try to find another solution
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
    handleError(error);
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
