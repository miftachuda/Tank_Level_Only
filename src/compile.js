/*
 * @Author: Allan
 * @Description: 加密源码
 */
const { app } = require("electron");
const v8 = require("v8");
const bytenode = require("bytenode");
const fs = require("fs");
const path = require("path");

v8.setFlagsFromString("--no-lazy");

const distPaths = ["./preloadsc/"];
let extNew = ".jsc";

function startByteCode() {
  const totalTimeLabel = "Start";
  console.time(totalTimeLabel);

  for (const disPath of distPaths) {
    const rootPath = path.join(__dirname, disPath);
    console.group("path:", rootPath);
    const timeLabel = "Bundling time";
    console.time(timeLabel);

    const filenames = fs.readdirSync(rootPath);
    filenames.forEach((filename) => {
      let ext = path.extname(filename);
      let base = path.basename(filename, ext);
      if (ext === ".js" || (ext === ".cjs" && base !== "esm-got")) {
        let filePath = path.join(rootPath, filename);
        let fileNameOut = base + extNew;
        let filePathOut = path.join(rootPath, fileNameOut);
        console.log("file: " + filePath);
        bytenode
          .compileFile({
            filename: filePath,
            output: filePathOut,
          })
          .then(() => {
            fs.writeFileSync(
              filePath,
              `require('bytenode');module.exports = require('./${fileNameOut}');`
            );
            let fileNameLoader = base + ".loader.js";
            let filePathLoader = path.join(rootPath, fileNameLoader);
            if (fs.existsSync(filePathLoader)) {
              fs.unlinkSync(filePathLoader);
            }
          });
      }
    });
    console.timeEnd(timeLabel);
    console.groupEnd();
    console.log("\n");
  }
  console.timeEnd(totalTimeLabel);
}

startByteCode();

app.quit();
