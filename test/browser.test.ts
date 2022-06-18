import testSuite from "./testSuite";

describe("with crypto mocked", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("./browserModule");

  testSuite<Uint8Array>(Uint8Array, mod, (size) => new Uint8Array(size));
});
