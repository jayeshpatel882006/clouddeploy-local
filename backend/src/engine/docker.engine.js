// ==========================================
// FUTURE PHASE
// Docker Engine (Registry Sync)
// ==========================================

// import { execSync } from "child_process";

// const runCmd = (cmd) => {
//   try {
//     const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
//     return { success: true, output: output.trim() };
//   } catch (error) {
//     return { success: false, error: error.stderr?.trim() || error.message };
//   }
// };

// const listImages = () => {
//   const result = runCmd(
//     'docker images --format "{{.Repository}}:{{.Tag}}|{{.ID}}|{{.Size}}"',
//   );

//   if (!result.success) return result;

//   const lines = result.output.split("\n").filter(Boolean);
//   const images = lines.map((line) => {
//     const [repoTag, id, size] = line.split("|");
//     const [repository, tag] = repoTag.split(":");
//     return { repository, tag, id, size };
//   });

//   return { success: true, images };
// };

// export { listImages };
