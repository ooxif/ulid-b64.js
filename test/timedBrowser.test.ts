import timedTestSuite from "./timedTestSuite";

describe("with crypto mocked", () => {
  const mod = require("./browserModule");

  timedTestSuite(mod);
});
