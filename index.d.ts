export interface Ulid<T extends Uint8Array = Uint8Array> {
  (): T;
}

export interface UlidString<T extends Uint8Array = Uint8Array> {
  (bytes?: T): string;
}

export interface UlidFromString<T extends Uint8Array = Uint8Array> {
  (string: string): T;
}

export interface IsValidUlid<T extends Uint8Array = Uint8Array> {
  (bytes: T): bytes is T;
}

export interface IsValidUlidString {
  (string: string): boolean;
}

declare const ulid: Ulid;
export default ulid;
export declare const ulidString: UlidString;
export declare const ulidFromString: UlidFromString;
export declare const isValidUlid: IsValidUlid;
export declare const isValidUlidString: IsValidUlidString;
