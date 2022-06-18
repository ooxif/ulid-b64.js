/// <reference types="node" />
import {
  Ulid,
  UlidString,
  UlidFromString,
  IsValidUlid,
  IsValidUlidString,
} from "../";

declare const ulid: Ulid<Buffer>;
export default ulid;
export declare const ulidString: UlidString<Buffer>;
export declare const ulidFromString: UlidFromString<Buffer>;
export declare const isValidUlid: IsValidUlid<Buffer>;
export declare const isValidUlidString: IsValidUlidString;
