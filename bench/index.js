/* eslint-disable @typescript-eslint/no-var-requires */
const sinon = require("@sinonjs/fake-timers");
const { ulid, monotonicFactory } = require("ulid");
const { ulid: ulidx, monotonicFactory: ulidxM } = require("ulidx");
const { Ulid: id128, UlidMonotonic: id128M } = require("id128");
const { default: ulidB64, ulidString } = require("../dist/node");
const { performance } = require("perf_hooks");

const iteration = Number(process.argv[2]) || 100000;
let now = Date.now();

const iterate = (generate) => {
  const clock = sinon.withGlobal(global).install({
    now,
    loopLimit: iteration,
  });

  for (let i = 0; i < iteration; ++i) {
    clock.setSystemTime(++now);
    generate();
  }

  clock.uninstall();
};

const iterateMonotonic = (generate) => {
  const clock = sinon.withGlobal(global).install({
    now,
    loopLimit: iteration,
  });

  for (let i = 0; i < iteration; ++i) {
    generate();

    if (!(i % 0b1111111)) {
      // advance 1 msec to avoid id128-ulid-monotonic's ClockSequenceOverflow
      // https://github.com/aarondcohen/id128/blob/4a8f911e306ef501458a7932ecbf059365658837/src/id/ulid-monotonic.js#L35
      clock.setSystemTime(++now);
    }
  }

  clock.uninstall();
};

const bench = (label, generate, iterate) => {
  performance.mark(`${label}:start`);
  iterate(generate);
  performance.mark(`${label}:end`);
  performance.measure(label, `${label}:start`, `${label}:end`);
  const result = performance.getEntriesByType("measure")[0].duration;
  performance.clearMarks();
  performance.clearMeasures();
  return result;
};

const id128Generate = id128.generate.bind(id128);
const id128GenerateM = id128M.generate.bind(id128M);

function id128ToCanonical(generate) {
  return function () {
    return generate().toCanonical();
  };
}

function id128ToRaw(generate) {
  return function () {
    return generate().toRaw();
  };
}

const generators = [
  ["ulid", ulid],
  ["ulid monotonic", monotonicFactory()],
  ["ulidx", ulidx],
  ["ulidx monotonic", ulidxM()],
  ["id128", id128Generate],
  ["id128 toCanonical", id128ToCanonical(id128Generate)],
  ["id128 toRaw", id128ToRaw(id128Generate)],
  ["id128 monotonic", id128GenerateM],
  ["id128 monotonic toCanonical", id128ToCanonical(id128GenerateM)],
  ["id128 monotonic toRaw", id128ToRaw(id128GenerateM)],
  ["ulid-b64 monotonic", ulidB64],
  ["ulid-b64 monotonic ulidString", ulidString],
];

for (const [iterationType, iterator] of [
  ["normal iteration", iterate],
  ["monotonic iteration", iterateMonotonic],
]) {
  const results = {};

  generators.forEach(([label, generate]) => {
    results[label] = [bench(label, generate, iterator)];
  });

  generators.forEach(([label, generate]) => {
    results[label][1] = bench(label, generate, iterator);
  });

  const max = { label: iterationType.length, digit: 0, frac: 0 };

  for (const [label, value] of Object.entries(results)) {
    if (label.length > max.label) {
      max.label = label.length;
    }

    const [digit, frac] = String(value[0] + value[1]).split(".");

    if (digit.length > max.digit) {
      max.digit = digit.length;
    }

    if (frac.length > max.frac) {
      max.frac = frac.length;
    }

    results[label] = [digit, frac === "" ? "0" : frac];
  }

  const header = `| ${iterationType.padEnd(
    max.label,
    " "
  )} | ${"duration".padEnd(max.digit + max.frac + 1, " ")} |`;
  console.log("-".repeat(header.length));
  console.log(header);
  console.log("-".repeat(header.length));

  for (const [key, [digit, frac]] of Object.entries(results)) {
    console.log(
      `| ${key.padEnd(max.label, " ")} | ${digit.padStart(
        max.digit,
        " "
      )}.${frac.padEnd(max.frac, "0")} |`
    );
  }
  console.log("-".repeat(header.length));
  console.log("");
}
