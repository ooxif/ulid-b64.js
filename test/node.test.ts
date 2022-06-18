import * as mod from "../src/node";
import testSuite from "./testSuite";

testSuite<Buffer>(Buffer, mod, (size) => Buffer.alloc(size));
