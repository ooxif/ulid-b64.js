# ulid-b64

Another [ULID](https://github.com/ulid/spec)-like implementation.

`ulid-b64` generates ULID as a binary, or as a base64-like sortable string.

## Install

```sh
npm i ulid-b64
# or
yarn add ulid-b64
```

## Usage

```ts
import ulid, {
    ulidString,
    ulidFromString,
    isValidUlid,
    isValidUlidString,
} from "ulid-b64";
// or "ulid-b64/node" for precise type definitions for Node.js environment.

// ulid() returns a ULID binary.
const id = ulid();

// On Node.js environment, it returns a `Buffer`.
// On browwser envrionment, it returns a `Uint8Array`.
expect(id).toBeInstanceOf(isNodeJS ? Buffer : Uint8Array);

// Both of them have exactly 16-length bytes.
expect(id).toHaveLength(16);

// ulidString() returns ULID in Sortable-string format.
const idStr = ulidString();

expect(typeof idStr).toBe("string");

// Sortable-string format consists of 0-9, A-Z, a-z, _, and -.
// The character set is the same as base64url, but not compatible.
// The "A" represents 0b000000 in base64url,
// but in Sortable-string it represents 0b001011.
// The length of ULID in Sortable-string format is 22.
expect(idStr).toMatch(/^[\dA-Za-z_-]{22}$/);

// Both of binary format and Sortable-string format are sortable.
const oldId = ulid();
const oldIdStr = ulidString();

await sleep(1);

const newId = ulid();
const newIdStr = ulidString();

expect(oldId < newId).toBe(true);
expect(oldIdStr < newIdStr).toBe(true);

// To convert a ULID binary into a string, use ulidString().
expect(ulidString(id)).toMatch(/^[\dA-Za-z_-]{22}$/);

// To convert a ULID string into a binary, use ulidFromString().
expect(ulidFromString(idStr)).toBeInstanceOf(isNodeJS ? Buffer : Uint8Array);

// Both of ulidString() and ulidFromString() do not check the value is valid or not.
// Test the value yourself before converting.

// Test whether the binary is a valid ULID binary or not.
expect(isValidUlid(id)).toBe(true);

// Test against a string.
expect(isValidUlidString(idStr)).toBe(true);
```
