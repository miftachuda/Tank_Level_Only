"use strict";
const path = require("path");
const bytenode = require("bytenode");
const fs = require("fs");
const v8 = require("v8");

v8.setFlagsFromString("--no-lazy");

if (!fs.existsSync("./main.jsc")) {
  bytenode.compileFile(
    path.join(__dirname, "./main.src.js"),
    path.join(__dirname, "./main.jsc")
  );
  fs.unlinkSync(path.join(__dirname, "./main.src.js"), () => {
    console.log("start up");
  });
}

require("./main.jsc");
