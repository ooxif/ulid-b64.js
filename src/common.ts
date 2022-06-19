import {
  Ulid,
  UlidString,
  UlidFromString,
  IsValidUlid,
  IsValidUlidString,
  ExtractTimeFromUlid,
  ExtractTimeFromUlidString,
} from "../index";

const chars =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".split("");
const charMap = new Map(chars.map((char, index) => [char, index]));
const radix = 2 ** 32;

// thanks to https://github.com/aarondcohen/id128/blob/4a8f911e306ef501458a7932ecbf059365658837/src/common/random-bytes.js
const randomBufferSize =
  4096 /* typical page size */ - 96; /* Empty buffer overhead */
const randomBuffer = new Uint8Array(randomBufferSize);
let randomBufferOffset = randomBufferSize;

const ulidSize = 16;
const xff = 0xff;
const prevCounter = new Uint8Array(3);
let prevTime: number;

export const ulidFactory = (crypto: Crypto) => {
  const getRandomValues = crypto.getRandomValues.bind(crypto);

  const ulid: Ulid = () => {
    const time = Date.now();

    let useRandomBufferTo = randomBufferOffset + ulidSize;

    if (useRandomBufferTo >= randomBufferSize) {
      randomBufferOffset = 0;
      useRandomBufferTo = ulidSize;
      getRandomValues(randomBuffer);
    }

    const bytes = randomBuffer.slice(randomBufferOffset, useRandomBufferTo);
    randomBufferOffset = useRandomBufferTo;

    const low = time % radix;
    const high = (time - low) / radix;

    bytes[0] = (high >>> 8) & xff;
    bytes[1] = high & xff;
    bytes[2] = (low >>> 24) & xff;
    bytes[3] = (low >>> 16) & xff;
    bytes[4] = (low >>> 8) & xff;
    bytes[5] = low & xff;

    if (time <= prevTime) {
      if (prevCounter[2] !== 0b1100_0000) {
        prevCounter[2] += 0b0100_0000;
      } else {
        prevCounter[2] = 0;

        if (++prevCounter[1] === 0x100 && ++prevCounter[0] === 0x100) {
          throw new Error("monotonic counter exhausted");
        }
      }

      bytes[6] = prevCounter[0];
      bytes[7] = prevCounter[1];
      bytes[8] = prevCounter[2] | (bytes[8] & 0b0011_1111);
    } else {
      bytes[6] &= 0b0111_1111;
      prevCounter[0] = bytes[6];
      prevCounter[1] = bytes[7];
      prevCounter[2] = bytes[8] & 0b1100_0000;

      prevTime = time;
    }

    return bytes;
  };

  const ulidString: UlidString = (bytes) => {
    bytes ??= ulid();

    return (
      chars[bytes[0] >>> 2] +
      chars[((bytes[0] & 0b11) << 4) | (bytes[1] >>> 4)] +
      chars[((bytes[1] & 0b1111) << 2) | (bytes[2] >>> 6)] +
      chars[bytes[2] & 0b11_1111] +
      chars[bytes[3] >>> 2] +
      chars[((bytes[3] & 0b11) << 4) | (bytes[4] >>> 4)] +
      chars[((bytes[4] & 0b1111) << 2) | (bytes[5] >>> 6)] +
      chars[bytes[5] & 0b11_1111] +
      chars[bytes[6] >>> 2] +
      chars[((bytes[6] & 0b11) << 4) | (bytes[7] >>> 4)] +
      chars[((bytes[7] & 0b1111) << 2) | (bytes[8] >>> 6)] +
      chars[bytes[8] & 0b11_1111] +
      chars[bytes[9] >>> 2] +
      chars[((bytes[9] & 0b11) << 4) | (bytes[10] >>> 4)] +
      chars[((bytes[10] & 0b1111) << 2) | (bytes[11] >>> 6)] +
      chars[bytes[11] & 0b11_1111] +
      chars[bytes[12] >>> 2] +
      chars[((bytes[12] & 0b11) << 4) | (bytes[13] >>> 4)] +
      chars[((bytes[13] & 0b1111) << 2) | (bytes[14] >>> 6)] +
      chars[bytes[14] & 0b11_1111] +
      chars[bytes[15] >>> 2] +
      chars[(bytes[15] & 0b11) << 4]
    );
  };

  return { ulid, ulidString };
};

export const isValidUlid: IsValidUlid = (bytes): bytes is Uint8Array =>
  bytes instanceof Uint8Array && bytes.length === ulidSize;

export const isValidUlidString: IsValidUlidString = (
  string
): string is string =>
  typeof string === "string" && /^[\dA-Za-z_-]{22}$/.test(string);

export const ulidFromString: UlidFromString = (string: string) => {
  const values = new Array(22);

  for (let i = 0; i < 22; ++i) {
    values[i] = charMap.get(string[i]);
  }

  const bytes = new Uint8Array(ulidSize);

  bytes[0] = (values[0] << 2) | (values[1] >>> 4);
  bytes[1] = ((values[1] & 0b1111) << 4) | (values[2] >>> 2);
  bytes[2] = ((values[2] & 0b11) << 6) | values[3];
  bytes[3] = (values[4] << 2) | (values[5] >>> 4);
  bytes[4] = ((values[5] & 0b1111) << 4) | (values[6] >>> 2);
  bytes[5] = ((values[6] & 0b11) << 6) | values[7];
  bytes[6] = (values[8] << 2) | (values[9] >>> 4);
  bytes[7] = ((values[9] & 0b1111) << 4) | (values[10] >>> 2);
  bytes[8] = ((values[10] & 0b11) << 6) | values[11];
  bytes[9] = (values[12] << 2) | (values[13] >>> 4);
  bytes[10] = ((values[13] & 0b1111) << 4) | (values[14] >>> 2);
  bytes[11] = ((values[14] & 0b11) << 6) | values[15];
  bytes[12] = (values[16] << 2) | (values[17] >>> 4);
  bytes[13] = ((values[17] & 0b1111) << 4) | (values[18] >>> 2);
  bytes[14] = ((values[18] & 0b11) << 6) | values[19];
  bytes[15] = (values[20] << 2) | (values[21] >>> 4);

  return bytes;
};

export const extractTimeFromUlid: ExtractTimeFromUlid = (bytes) => {
  return (
    ((bytes[0] << 8) | bytes[1]) * radix +
    ((bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5])
  );
};

export const extractTimeFromUlidString: ExtractTimeFromUlidString = (
  string
) => {
  const values = new Array(8);

  for (let i = 0; i < 8; ++i) {
    values[i] = charMap.get(string[i]);
  }

  return (
    ((values[0] << 10) | (values[1] << 4) | (values[2] >>> 2)) * radix +
    (((values[2] & 0b11) << 30) |
      (values[3] << 24) |
      (values[4] << 18) |
      (values[5] << 12) |
      (values[6] << 6) |
      values[7])
  );
};
