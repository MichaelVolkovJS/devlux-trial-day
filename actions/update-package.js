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

const getCurrentPackageJson = async (repoName, branchName) => {
  try {
    console.info("Getting current package.json...");
    return await get(
      `${API_BASE_URL}/${repoName}/src/${branchName}/package.json`,
      { auth: bitBucketAuth }
    );
  } catch (error) {
    handleError(error);
  }
};

const commitWithChanges = async (
  updatedPackageJson,
  commitMessage,
  branchName,
  repoName
) => {
  try {
    console.info("Commiting the changes...");
    await post(
      `${API_BASE_URL}/${repoName}/src/`,
      {
        message: commitMessage,
        // TODO: try to find another solution
        "package.json": updatedPackageJson,
        branch: branchName,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: bitBucketAuth,
      }
    );
  } catch (error) {
    handleError(error);
  }
};

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
      const commitMessage = `Update ${packageName} to version ${packageVersion}`;
      await commitWithChanges(
        updatedPackageJson,
        commitMessage,
        newBranchName,
        repoName
      );
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
// node script.js <repoName> <packageName> <packageVersion>
const [repoName, packageName, packageVersion] = process.argv.slice(2);

if (!packageName || !packageVersion) {
  console.error("Please use the package name and the package version");
} else {
  updatePackageAndOpenPR(repoName, packageName, packageVersion);
}
