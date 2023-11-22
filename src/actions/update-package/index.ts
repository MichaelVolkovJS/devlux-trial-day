import "dotenv/config";
import { program } from "commander";
import { updatePackageAndOpenPR } from "./main";

program
  .requiredOption("-r, --repoName <string>", "Repository name")
  .requiredOption("-p, --packageName <string>", "NPM Package name")
  .requiredOption("-v, --packageVersion <string>", "NPM Package version")
  .action((options) => {
    const { repoName, packageName, packageVersion } = options;

    updatePackageAndOpenPR(repoName, packageName, packageVersion);
  })
  .parse();
