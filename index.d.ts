export interface Ulid {
  (): Uint8Array;
}

export interface UlidString {
  (bytes?: Uint8Array): string;
}

export interface UlidFromString {
  (string: string): Uint8Array;
}

export interface IsValidUlid {
  (bytes: Uint8Array): bytes is T;
}

export interface IsValidUlidString {
  (string: string): string is string;
}

export interface ExtractTimeFromUlid {
  (bytes: Uint8Array): number;
}

export interface ExtractTimeFromUlidString {
  (string: string): number;
}

declare const ulid: Ulid;
export default ulid;
export declare const ulidString: UlidString;
export declare const ulidFromString: UlidFromString;
export declare const isValidUlid: IsValidUlid;
export declare const isValidUlidString: IsValidUlidString;
export declare const extractTimeFromUlid: ExtractTimeFromUlid;
export declare const extractTimeFromUlidString: ExtractTimeFromUlidString;
