import { randomFillSync } from "node:crypto";
import type { Ulid, UlidString, UlidFromString, IsValidUlid } from "../index";
import { isValidUlidString, ulidToString, fillBytesByString } from "./common";

export { isValidUlidString };

const radix = 2 ** 32;
const bytes = Buffer.alloc(16);
let lastTime: number;

const ulid: Ulid<Buffer> = () => {
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

    randomFillSync(bytes, 6);
    bytes[0] = (high >>> 8) & 0xff;
    bytes[1] = high & 0xff;
    bytes[2] = (low >>> 24) & 0xff;
    bytes[3] = (low >>> 16) & 0xff;
    bytes[4] = (low >>> 8) & 0xff;
    bytes[5] = low & 0xff;
    lastTime = time;
  }

  return Buffer.from(bytes);
};

export default ulid;

export const ulidString: UlidString<Buffer> = (bytes) =>
  ulidToString(bytes ?? ulid());

export const ulidFromString: UlidFromString<Buffer> = (string) =>
  fillBytesByString<Buffer>(Buffer.alloc(16), string);

export const isValidUlid: IsValidUlid<Buffer> = (bytes): bytes is Buffer =>
  bytes instanceof Buffer && bytes.length === 16;
