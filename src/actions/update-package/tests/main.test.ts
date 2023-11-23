import { handleError } from "../../../utils/handle-error";
import {
  commitChanges,
  createBranch,
  createPullRequest,
  getCurrentPackageJson,
  getMainBranch,
  updatePackageJson,
} from "../bit-bucket-actions";
import { updatePackageAndOpenPR } from "../main";

jest.mock("../bit-bucket-actions/get-main-branch");
jest.mock("../bit-bucket-actions/get-current-package-json");
jest.mock("../bit-bucket-actions/create-branch");
jest.mock("../bit-bucket-actions/commit-changes");
jest.mock("../bit-bucket-actions/create-pr");
jest.mock("../bit-bucket-actions/update-package-json");
jest.mock("../../../utils/handle-error");

describe("updatePackageAndOpenPR", () => {
  it("should update `package.json` and open a PR", async () => {
    const repoName = "mock-repo";
    const packageName = "mock-package";
    const packageVersion = "1.0.0";
    const mainBranchName = "main";
    const currentPackageJson = {
      data: {
        /* mocked package.json file */
      },
    };
    const updatedPackageJson = {
      /* mocked updated package.json file */
    };
    const newBranchName = `update-${packageName}-to-${packageVersion}`;
    const commitBody = {
      branch: `update-${packageName}-to-${packageVersion}`,
      message: `Update ${packageName} to version ${packageVersion}`,
      "package.json": {},
    };
    const pullRequestBody = {
      destination: {
        branch: {
          name: "main",
        },
      },
      source: {
        branch: {
          name: `update-${packageName}-to-${packageVersion}`,
        },
      },
      title: `Update ${packageName} to version ${packageVersion}`,
    };

    // mock methods
    (getMainBranch as jest.Mock).mockResolvedValue(mainBranchName);
    (getCurrentPackageJson as jest.Mock).mockResolvedValue(currentPackageJson);
    (updatePackageJson as jest.Mock).mockReturnValue(updatedPackageJson);
    (createBranch as jest.Mock).mockResolvedValue({});
    (commitChanges as jest.Mock).mockResolvedValue({});
    (createPullRequest as jest.Mock).mockResolvedValue({});

    await updatePackageAndOpenPR(repoName, packageName, packageVersion);

    expect(getMainBranch).toHaveBeenCalledWith(repoName);
    expect(getCurrentPackageJson).toHaveBeenCalledWith(
      repoName,
      mainBranchName
    );
    expect(updatePackageJson).toHaveBeenCalledWith(
      currentPackageJson.data,
      packageName,
      packageVersion
    );
    expect(createBranch).toHaveBeenCalledWith(
      mainBranchName,
      repoName,
      newBranchName
    );
    expect(commitChanges).toHaveBeenCalledWith(commitBody, repoName);
    expect(createPullRequest).toHaveBeenCalledWith(pullRequestBody, repoName);

    // should not be called
    expect(handleError).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    // mock data
    const repoName = "mock-repo";
    const packageName = "mock-package";
    const packageVersion = "1.0.0";
    const error = new Error("Mocked error");

    (getMainBranch as jest.Mock).mockRejectedValue(error);

    await updatePackageAndOpenPR(repoName, packageName, packageVersion);

    expect(handleError).toHaveBeenCalledWith(error);
  });
});
