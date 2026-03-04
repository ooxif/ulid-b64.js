import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dirname = fileURLToPath(new URL(".", import.meta.url));

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // "join(__dirname, ...)" due to a bug.
  // @see https://github.com/facebook/jest/issues/7108
  testMatch: [join(dirname, "test/**/*.test.ts")],
};

export default config;
