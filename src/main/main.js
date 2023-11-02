"use strict";
const path = require("path");
const bytenode = require("bytenode");
const fs = require("fs");
const v8 = require("v8");
const distPaths = [path.join(__dirname, "../preload")];

let extNew = ".jsc";
let extOld = ".js";
v8.setFlagsFromString("--no-lazy");

function startByteCode() {
  const totalTimeLabel = "Start";
  console.time(totalTimeLabel);

  for (const disPath of distPaths) {
    const rootPath = path.join(__dirname, disPath);
    const outPath = path.join(__dirname, "../preload/");
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
        let loaderNameOut = base + extOld;
        let filePathOut = path.join(outPath, fileNameOut);
        let fileLoaderout = path.join(outPath, loaderNameOut);
        console.log("file: " + filePath);
        bytenode
          .compileFile({
            filename: filePath,
            output: filePathOut,
          })
          .then(() => {
            fs.writeFileSync(
              fileLoaderout,
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

if (!fs.existsSync(path.join(__dirname, "./main.jsc"))) {
  bytenode.compileFile(
    path.join(__dirname, "./main.src.js"),
    path.join(__dirname, "./main.jsc")
  );
  fs.unlinkSync(path.join(__dirname, "./main.src.js"), () => {
    console.log("start up");
  });
  startByteCode();
}

require("./main.src.js");
