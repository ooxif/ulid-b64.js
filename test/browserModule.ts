import { randomFillSync } from "node:crypto";

Object.defineProperty(global, "crypto", {
  configurable: true,
  enumerable: false,
  value: {
    getRandomValues(bytes: Uint8Array) {
      randomFillSync(bytes);

      return bytes;
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mod = require("../src/browser");

delete (global as unknown as { crypto: unknown }).crypto;

module.exports = mod;
