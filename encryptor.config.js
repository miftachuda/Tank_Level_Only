import { defineConfig } from "electron-builder-encryptor";

export default defineConfig({
  key: "xxx000777",
  protocol: "myclient2",
  privileges: {
    standard: true,
    secure: true,
    bypassCSP: true,
    allowServiceWorkers: true,
    /** test, recommended true  */
    supportFetchAPI: false,
    corsEnabled: true,
    stream: true,
  },
  preload: ["./src/preload/preload.js", "./src/preload/record.js"],
  renderer: {
    entry: "../renderer",
    output: "resources/renderer.pkg",
  },
  syncValidationChanges: true,
});
