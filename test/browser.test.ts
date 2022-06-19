import testSuite from "./testSuite";

describe("with crypto mocked", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("./browserModule");

  testSuite(mod);
});
