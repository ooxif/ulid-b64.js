import {
  Ulid,
  UlidFromString,
  UlidString,
  IsValidUlid,
  IsValidUlidString,
} from "../index";

interface BytesConstructor<T extends Uint8Array> {
  new (size: number): T;
}

export interface TestSuiteFunctions<T extends Uint8Array> {
  default: Ulid<T>;
  ulidString: UlidString<T>;
  ulidFromString: UlidFromString<T>;
  isValidUlid: IsValidUlid<T>;
  isValidUlidString: IsValidUlidString;
}

const testSuite = <T extends Uint8Array>(
  BytesClass: BytesConstructor<T>,
  {
    default: ulid,
    ulidString,
    ulidFromString,
    isValidUlid,
    isValidUlidString,
  }: TestSuiteFunctions<T>,
  alloc: (size: number) => T
) => {
  const isUlid = (bytes: T, ...values: number[]) => {
    expect(bytes).toBeInstanceOf(BytesClass);
    expect(bytes).toHaveLength(16);

    if (!values.length) return;

    expect([...bytes]).toStrictEqual(values);
  };

  test("uild()", () => {
    isUlid(ulid());
  });

  test("ulidString()", () => {
    const idStr = ulidString();

    expect(typeof idStr).toBe("string");
    expect(idStr).toMatch(/^[\dA-Za-z_-]{22}$/);
  });

  (() => {
    const table = {
      "----------------------": 0,
      zzzzzzzzzzzzzzzzzzzzzz: 255,
    };

    for (const [key, value] of Object.entries(table)) {
      test(`ulidFromString("${key}")`, () => {
        isUlid(ulidFromString(key), ...new Array(16).fill(value));
      });
    }
  })();

  (() => {
    const table = {
      "15": false,
      "16": true,
      "17": false,
    };

    for (const [key, value] of Object.entries(table)) {
      test(`isValidUlid(bytes) (length = ${key})`, () => {
        expect(isValidUlid(alloc(Number(key)))).toBe(value);
      });
    }
  })();

  (() => {
    const table = {
      "": false,
      aaaaaaaaaaaaaaaaaaaaa: false,
      "                      ": false,
      "======================": false,
      "++++++++++++++++++++++": false,
      AAAAAAAAAAAAAAAAAAAAAA: true,
      ZZZZZZZZZZZZZZZZZZZZZZ: true,
      aaaaaaaaaaaaaaaaaaaaaa: true,
      zzzzzzzzzzzzzzzzzzzzzz: true,
      "0000000000000000000000": true,
      "9999999999999999999999": true,
      "----------------------": true,
      ______________________: true,
      AAAAAAAAAAAAAAAAAAAAAAA: false,
    };

    for (const [key, value] of Object.entries(table)) {
      test(`isValidUlidString("${key}") (length = ${key.length})`, () => {
        expect(isValidUlidString(key)).toBe(value);
      });
    }
  })();

  test("complex", () => {
    const id = ulid();
    const idStr = ulidString(id);
    const id2 = ulidFromString(idStr);
    const idStr2 = ulidString(id2);

    expect([...id]).toStrictEqual([...id2]);
    expect(idStr).toBe(idStr2);
  });
};

export default testSuite;
