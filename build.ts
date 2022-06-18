import { build } from "esbuild";

build({
  bundle: true,
  logLevel: "info",
  minify: true,
  sourcemap: false,
  entryPoints: ["src/browser.ts"],
  format: "esm",
  outfile: "./browser/index.js",
  target: ["ES2020"],
  platform: "browser",
});

build({
  bundle: true,
  logLevel: "info",
  minify: true,
  sourcemap: false,
  entryPoints: ["src/node.ts"],
  format: "cjs",
  outfile: "./node/index.js",
  target: ["ES2020"],
  platform: "node",
});
