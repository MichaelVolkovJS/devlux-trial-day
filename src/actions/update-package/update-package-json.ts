import semver from "semver";

/**
 * This method update the `package.json` file and validate the packages
 * @param {string} repoName
 * @param {string} packageName
 * @param {string} packageVersion
 */
export const updatePackageJson = (
  packageJson: any,
  packageName: string,
  packageVersion: string
) => {
  // check the valid version
  if (!semver.valid(packageVersion)) {
    throw Error("Invalid version");
  }

  const originalPackageJson = JSON.stringify(packageJson, null, 2);

  const dependenciKeys = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ];

  dependenciKeys.forEach((key) => {
    if (!packageJson[key] || !packageJson[key][packageName]) {
      return;
    }
    if (semver.lt(packageVersion, packageJson[key][packageName])) {
      throw Error("Package version should be higher");
    }

    packageJson[key][packageName] = packageVersion;
  });

  const updatedPackageJson = JSON.stringify(packageJson, null, 2);

  if (originalPackageJson === updatedPackageJson) {
    throw Error(
      "The new file is the same as the old one or package does not exist"
    );
  }

  return updatedPackageJson;
};
