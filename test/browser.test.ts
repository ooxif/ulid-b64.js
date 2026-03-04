import testSuite from "./testSuite";

describe("with crypto mocked", () => {
  const mod = require("./browserModule");

  testSuite(mod);
});
