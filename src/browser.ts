import {
  ulidFactory,
  ulidFromString,
  isValidUlid,
  isValidUlidString,
  extractTimeFromUlid,
  extractTimeFromUlidString,
} from "./common";

const { ulid, ulidString } = ulidFactory(crypto);

export default ulid;

export {
  ulidString,
  ulidFromString,
  isValidUlid,
  isValidUlidString,
  extractTimeFromUlid,
  extractTimeFromUlidString,
};
