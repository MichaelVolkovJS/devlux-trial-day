# How to use it?

1. clone the repo
2. run `npm i`
3. run `npm run update-package -- --repoName <repo-name> --packageName <package-name> --packageVersion <package-version>`

Aliases for CLI:

- `--repoName`:`-r`
- `--packageName`:`-p`
- `--packageVersion`:`-v`

## How does it work?

1. Create new branch with name `update-${packageName}-to-${packageVersion}`
2. Update the `package.json` file
3. Create a new commit with updated `package.json` file in a new branch
4. Create PR in master from the new branch
