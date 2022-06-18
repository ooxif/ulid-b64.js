import type { Ulid, UlidString, UlidFromString, IsValidUlid } from "../index";
import { isValidUlidString, ulidToString, fillBytesByString } from "./common";

export { isValidUlidString };

const getRandomValues = crypto.getRandomValues.bind(crypto);
const radix = 2 ** 32;

const bytes = new Uint8Array(16);
let lastTime: number;

const ulid: Ulid = () => {
  const time = Date.now();

  if (lastTime === time) {
    ++bytes[15] === 0x100 &&
      ++bytes[14] === 0x100 &&
      ++bytes[13] === 0x100 &&
      ++bytes[12] === 0x100 &&
      ++bytes[11] === 0x100 &&
      ++bytes[10] === 0x100 &&
      ++bytes[9] === 0x100 &&
      ++bytes[8] === 0x100 &&
      ++bytes[7] === 0x100 &&
      ++bytes[6];
  } else {
    const low = time % radix;
    const high = (time - low) / radix;

    getRandomValues(bytes);
    bytes[0] = (high >>> 8) & 0xff;
    bytes[1] = high & 0xff;
    bytes[2] = (low >>> 24) & 0xff;
    bytes[3] = (low >>> 16) & 0xff;
    bytes[4] = (low >>> 8) & 0xff;
    bytes[5] = low & 0xff;
    lastTime = time;
  }

  return Uint8Array.from(bytes);
};

export default ulid;

export const ulidString: UlidString = (bytes) => ulidToString(bytes ?? ulid());

export const ulidFromString: UlidFromString = (string) =>
  fillBytesByString(new Uint8Array(16), string);

export const isValidUlid: IsValidUlid = (bytes): bytes is Uint8Array =>
  bytes instanceof Uint8Array && bytes.length === 16;
