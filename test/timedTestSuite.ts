import type { TestSuiteFunctions } from "./testSuite";

const toNumber = (numbers: number[]) => {
  let sum = 0;
  let pos = 0;

  for (let i = numbers.length - 1; i >= 0; --i) {
    sum += numbers[i] * 0xff ** pos;
    ++pos;
  }

  return sum;
};

const timedTestSuite = <T extends Uint8Array>({
  default: ulid,
  ulidString,
}: TestSuiteFunctions<T>) => {
  test("ulid() generation within the same time", () => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const id0 = [...ulid()];
    const id1 = [...ulid()];

    const time0 = id0.slice(0, 6);
    const time1 = id1.slice(0, 6);

    expect(time0).toStrictEqual(time1);

    const rand00 = toNumber(id0.slice(6, 10));
    const rand01 = toNumber(id0.slice(10, 14));
    const rand02 = toNumber(id0.slice(14));
    const rand10 = toNumber(id1.slice(6, 10));
    const rand11 = toNumber(id1.slice(10, 14));
    const rand12 = toNumber(id1.slice(14));

    if (rand12) {
      expect(rand02).toBe(rand12 - 1);
    } else if (rand11) {
      expect(rand01).toBe(rand11 - 1);
    } else if (rand10) {
      expect(rand00).toBe(rand10 - 1);
    } else {
      expect(rand00).toBe(0xffffffff);
      expect(rand01).toBe(0xffffffff);
      expect(rand02).toBe(0xffff);
    }
  });

  test("sortable", () => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const oldId = ulid();
    const oldIdStr = ulidString();

    jest.setSystemTime(1);

    const newId = ulid();
    const newIdStr = ulidString();

    expect(oldId < newId).toBe(true);
    expect(oldId > newId).toBe(false);
    expect(oldIdStr < newIdStr).toBe(true);
    expect(oldIdStr > newIdStr).toBe(false);
  });
};

export default timedTestSuite;
