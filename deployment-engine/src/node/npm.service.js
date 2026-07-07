// ==========================================
// TODO: Future Phase
// npm dependency installation (currently paused)
// ==========================================

// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

// /**
//  * Install npm dependencies
//  * @param {string} projectPath
//  */
// export const installDependencies = async (projectPath) => {
//   try {
//     const { stdout, stderr } = await execAsync("npm install --omit=dev", {
//       cwd: projectPath,
//     });

//     return {
//       success: true,
//       stdout,
//       stderr,
//     };
//   } catch (error) {
//     throw new Error(`npm install failed:\n${error.message}`);
//   }
// };
