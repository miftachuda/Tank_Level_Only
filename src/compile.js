const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      child.kill("SIGINT");
      resolve(stdout ? stdout : stderr);
    });
  });
}
exports.default = async function (context) {
  console.log("Starting after pack Compiler");

  const binaryPath = path.join(
    __dirname,
    "../dist/win-unpacked/tanklevelapp.exe"
  );
  fs.chmodSync(binaryPath, 0o777);
  const args = [];
  var out = await execShellCommand(binaryPath);
  console.log(out);
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("Pause for 2 seconds");
      resolve();
    }, 2000);
  });
  console.log("Finish after pack Compiler");
};
