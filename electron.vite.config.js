import { resolve } from "path";
import {
  defineConfig,
  externalizeDepsPlugin,
  bytecodePlugin,
} from "electron-vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "main.js"),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "preload.js"),
        },
      },
    },
  },
  renderer: {
    // resolve: {
    //   alias: {
    //     "@renderer": resolve("/"),
    //   },
    // },
    // plugins: [],
    root: ".",
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "./tanklevelapp.html"),
        },
      },
    },
  },
});
