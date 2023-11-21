# How to use it?

Example: `node actions/update-package.js <repo-name> <package-name> <new-package-versions>`

## how does it work?

1. Create new branch with name `update-${packageName}-to-${packageVersion}`
2. Update the `package.json` file
3. Create a new commit with updated `package.json` file in a new branch
4. Create PR in master from the new branch
