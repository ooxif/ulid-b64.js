import { build } from "esbuild";

build({
  bundle: true,
  logLevel: "info",
  minify: true,
  sourcemap: false,
  entryPoints: ["src/browser.ts"],
  format: "esm",
  outfile: "./dist/browser.js",
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
  outfile: "./dist/node.js",
  target: ["ES2020"],
  platform: "node",
});
