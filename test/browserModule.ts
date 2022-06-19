import { webcrypto } from "node:crypto";

type WebCrypto = typeof webcrypto & {
  getRandomValues(bytes: Uint8Array): Uint8Array;
};

Object.defineProperty(global, "crypto", {
  configurable: true,
  enumerable: false,
  value: {
    getRandomValues(bytes: Uint8Array) {
      (webcrypto as WebCrypto).getRandomValues(bytes);

      return bytes;
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mod = require("../src/browser");

delete (global as unknown as { crypto: unknown }).crypto;

module.exports = mod;
