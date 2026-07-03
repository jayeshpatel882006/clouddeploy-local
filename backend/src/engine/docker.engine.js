import { execSync } from "child_process";

const runCmd = (cmd) => {
  try {
    const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { success: false, error: error.stderr?.trim() || error.message };
  }
};

/* ─── Build Image ──────────────────────────── */

const buildImage = (imageName, dockerfilePath = ".", tag = "latest") => {
  const result = runCmd(`docker build -t ${imageName}:${tag} ${dockerfilePath}`);
  return { ...result, image: `${imageName}:${tag}` };
};

/* ─── Tag Image ────────────────────────────── */

const tagImage = (sourceImage, targetImage) => {
  const result = runCmd(`docker tag ${sourceImage} ${targetImage}`);
  return { ...result, source: sourceImage, target: targetImage };
};

/* ─── Push Image ───────────────────────────── */

const pushImage = (imageName, tag = "latest") => {
  const result = runCmd(`docker push ${imageName}:${tag}`);
  return { ...result, image: `${imageName}:${tag}` };
};

/* ─── Pull Image ───────────────────────────── */

const pullImage = (imageName, tag = "latest") => {
  const result = runCmd(`docker pull ${imageName}:${tag}`);
  return { ...result, image: `${imageName}:${tag}` };
};

/* ─── Delete Image ─────────────────────────── */

const deleteImage = (imageName, tag = "latest") => {
  const result = runCmd(`docker rmi ${imageName}:${tag}`);
  return { ...result, image: `${imageName}:${tag}` };
};

/* ─── List Images ──────────────────────────── */

const listImages = () => {
  const result = runCmd(
    'docker images --format "{{.Repository}}:{{.Tag}}|{{.ID}}|{{.Size}}"',
  );

  if (!result.success) return result;

  const lines = result.output.split("\n").filter(Boolean);
  const images = lines.map((line) => {
    const [repoTag, id, size] = line.split("|");
    const [repository, tag] = repoTag.split(":");
    return { repository, tag, id, size };
  });

  return { success: true, images };
};

export {
  buildImage,
  tagImage,
  pushImage,
  pullImage,
  deleteImage,
  listImages,
};
