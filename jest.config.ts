import { join } from "node:path";

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // "join(__dirname, ...)" due to a bug.
  // @see https://github.com/facebook/jest/issues/7108
  testMatch: [join(__dirname, "test/**/*.test.ts")],
};

export default config;
