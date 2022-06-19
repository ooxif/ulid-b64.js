import type { TestSuiteFunctions } from "./testSuite";

const toNumber = (numbers: number[]) => {
  let sum = 0;
  let pos = 0;

  for (let i = numbers.length - 1; i >= 0; --i) {
    sum += numbers[i] * 0x100 ** pos;
    ++pos;
  }

  return sum;
};

const timedTestSuite = ({
  default: ulid,
  ulidString,
  extractTimeFromUlid,
  extractTimeFromUlidString,
}: TestSuiteFunctions) => {
  test("ulid() generation within the same time", () => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const id0 = [...ulid()];
    const id1 = [...ulid()];

    const time0 = id0.slice(0, 6);
    const time1 = id1.slice(0, 6);

    expect(time0).toStrictEqual(time1);

    id0[8] &= 0b1100_0000;
    id1[8] &= 0b1100_0000;
    const rand0 = toNumber(id0.slice(6, 9));
    const rand1 = toNumber(id1.slice(6, 9));

    expect(rand1).toBe(rand0 + 0b0100_0000);
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

  for (const time of [0, 1, 1655638494874]) {
    test(`extractTimeFromUlid (time=${time})`, () => {
      jest.useFakeTimers();
      jest.setSystemTime(time);

      const id = ulid();
      const idStr = ulidString();

      expect(extractTimeFromUlid(id)).toBe(time);
      expect(extractTimeFromUlidString(idStr)).toBe(time);
    });
  }
};

export default timedTestSuite;
