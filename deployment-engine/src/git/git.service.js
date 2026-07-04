import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const git = simpleGit();

export const cloneRepository = async (repositoryUrl, branch = "main") => {
  const repoName = repositoryUrl.split("/").pop().replace(".git", "");

  const workspace = path.join(process.cwd(), "workspace");

  if (!fs.existsSync(workspace)) {
    fs.mkdirSync(workspace);
  }

  const destination = path.join(workspace, repoName);

  if (fs.existsSync(destination)) {
    throw new Error("Repository already exists in workspace.");
  }

  await git.clone(repositoryUrl, destination, [
    "--branch",
    branch,
    "--single-branch",
  ]);

  return {
    repositoryName: repoName,
    branch,
    path: destination,
  };
};
