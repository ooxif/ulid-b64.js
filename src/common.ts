import { IsValidUlidString } from "../index";

const chars =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".split("");
const map = new Map(chars.map((char, index) => [char, index]));

export const isValidUlidString: IsValidUlidString = (string) =>
  typeof string === "string" && /^[\dA-Za-z_-]{22}$/.test(string);

export const ulidToString = (bytes: Uint8Array) => {
  return (
    chars[bytes[0] >>> 2] +
    chars[((bytes[0] & 0b11) << 4) | (bytes[1] >>> 4)] +
    chars[((bytes[1] & 0b1111) << 2) | (bytes[2] >>> 6)] +
    chars[bytes[2] & 0b111111] +
    chars[bytes[3] >>> 2] +
    chars[((bytes[3] & 0b11) << 4) | (bytes[4] >>> 4)] +
    chars[((bytes[4] & 0b1111) << 2) | (bytes[5] >>> 6)] +
    chars[bytes[5] & 0b111111] +
    chars[bytes[6] >>> 2] +
    chars[((bytes[6] & 0b11) << 4) | (bytes[7] >>> 4)] +
    chars[((bytes[7] & 0b1111) << 2) | (bytes[8] >>> 6)] +
    chars[bytes[8] & 0b111111] +
    chars[bytes[9] >>> 2] +
    chars[((bytes[9] & 0b11) << 4) | (bytes[10] >>> 4)] +
    chars[((bytes[10] & 0b1111) << 2) | (bytes[11] >>> 6)] +
    chars[bytes[11] & 0b111111] +
    chars[bytes[12] >>> 2] +
    chars[((bytes[12] & 0b11) << 4) | (bytes[13] >>> 4)] +
    chars[((bytes[13] & 0b1111) << 2) | (bytes[14] >>> 6)] +
    chars[bytes[14] & 0b111111] +
    chars[bytes[15] >>> 2] +
    chars[(bytes[15] & 0b11) << 4]
  );
};

export const fillBytesByString = <T extends Uint8Array>(
  bytes: T,
  string: string
) => {
  const values = new Array(22);

  for (let i = 0; i < 22; ++i) {
    values[i] = map.get(string[i]);
  }

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
