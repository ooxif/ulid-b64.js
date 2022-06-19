import { webcrypto } from "node:crypto";
import {
  ulidFactory,
  ulidFromString,
  isValidUlid,
  isValidUlidString,
  extractTimeFromUlid,
  extractTimeFromUlidString,
} from "./common";

const { ulid, ulidString } = ulidFactory(webcrypto as unknown as Crypto);

export default ulid;

export {
  ulidString,
  ulidFromString,
  isValidUlid,
  isValidUlidString,
  extractTimeFromUlid,
  extractTimeFromUlidString,
};
