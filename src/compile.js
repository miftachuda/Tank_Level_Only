const { exec } = require("node:child_process");
const path = require("path");

const mainPath = path.join(
  __dirname,
  "dist/win-unpacked/resources/app/src/main/main.js"
);
function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    const child = exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
exports.default = async function (context) {
  console.log("Starting after pack Compiler");

  const binaryPath = path.join(
    __dirname,
    "../dist/win-unpacked/tanklevelapp.exe"
  ); // Replace with the actual path to your binary
  fs.chmodSync(binaryPath, 0o777);
  const args = []; // Replace with any arguments you want to pass to the binary
  var out = await execShellCommand(binaryPath);
  console.log(out);
  // const childProcess = exec(binaryPath, args, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error executing binary: ${error}`);
  //     return;
  //   }
  //   setTimeout(() => {
  //     childProcess.kill("SIGINT");
  //   }, 3000);
  //   console.log(`Standard output: ${stdout}`);
  //   childProcess.kill("SIGINT");
  //   console.error(`Standard error: ${stderr}`);
  // });
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("Pause for 2 seconds");
      resolve();
    }, 2000);
  });
  console.log("Finish after pack Compiler");
};
