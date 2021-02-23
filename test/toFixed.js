import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

describe("#toFixed()", () => {
  it("agrees with `Number#toFixed()`, except -0 and rounding", () => {
    const patNegZero = /^-(0(?:\.0+)?)$/;
    const cases = [0, 1, -1, 12345678, -12345678];
    for (const e of cases) {
      const b = BigInt(e);
      for (let den = 1; den < 100_000_000_000; den *= 10) {
        const n = e / den;
        const f = new BigAmount(b, BigInt(den));
        for (let ndigits = 0; ndigits < 10; ndigits++) {
          let expected = n.toFixed(ndigits);
          const match = expected.match(patNegZero);
          if (match) {
            expected = match[1];
          }
          assert.strictEqual(f.toFixed(ndigits), expected);
        }
      }
    }
  });

  it("formats fractions with arbitrary denominators", () => {
    const cases = [
      Math.E,
      Math.LN2,
      Math.LN10,
      Math.LOG2E,
      Math.LOG10E,
      Math.PI,
      Math.SQRT1_2,
      Math.SQRT2,
    ];

    for (const e of cases) {
      const f = BigAmount.fromNumber(e);
      for (let ndigits = 0; ndigits < 10; ndigits++) {
        assert.strictEqual(f.toFixed(ndigits), e.toFixed(ndigits));
      }
    }
  });

  it("handles `decimalSeparator` and `groupSeparator` options properly", () => {
    const f = (den, ds) =>
      new BigAmount(12345678n, den).toFixed(ds, {
        decimalSeparator: "{ds}",
        groupSeparator: "{gs}",
      });

    assert.strictEqual(f(1n, 0), "12{gs}345{gs}678");
    assert.strictEqual(f(-1n, 0), "-12{gs}345{gs}678");

    assert.strictEqual(f(1n, 9), "12{gs}345{gs}678{ds}000000000");
    assert.strictEqual(f(10n, 9), "1{gs}234{gs}567{ds}800000000");
    assert.strictEqual(f(100n, 9), "123{gs}456{ds}780000000");
    assert.strictEqual(f(1000n, 9), "12{gs}345{ds}678000000");
    assert.strictEqual(f(10000n, 9), "1{gs}234{ds}567800000");
    assert.strictEqual(f(100000n, 9), "123{ds}456780000");
    assert.strictEqual(f(1000000n, 9), "12{ds}345678000");
    assert.strictEqual(f(10000000n, 9), "1{ds}234567800");
    assert.strictEqual(f(100000000n, 9), "0{ds}123456780");
    assert.strictEqual(f(1000000000n, 9), "0{ds}012345678");
    assert.strictEqual(f(-1n, 9), "-12{gs}345{gs}678{ds}000000000");
    assert.strictEqual(f(-10n, 9), "-1{gs}234{gs}567{ds}800000000");
    assert.strictEqual(f(-100n, 9), "-123{gs}456{ds}780000000");
    assert.strictEqual(f(-1000n, 9), "-12{gs}345{ds}678000000");
    assert.strictEqual(f(-10000n, 9), "-1{gs}234{ds}567800000");
    assert.strictEqual(f(-100000n, 9), "-123{ds}456780000");
    assert.strictEqual(f(-1000000n, 9), "-12{ds}345678000");
    assert.strictEqual(f(-10000000n, 9), "-1{ds}234567800");
    assert.strictEqual(f(-100000000n, 9), "-0{ds}123456780");
    assert.strictEqual(f(-1000000000n, 9), "-0{ds}012345678");
  });

  it("handles `templates` option properly");

  it("handles `experimentalUseLakhCrore` option properly", () => {
    const f = (den, ds) =>
      new BigAmount(12345678n, den).toFixed(ds, {
        decimalSeparator: "{ds}",
        groupSeparator: "{gs}",
        experimentalUseLakhCrore: true,
      });

    assert.strictEqual(f(1n, 0), "1{gs}23{gs}45{gs}678");
    assert.strictEqual(f(-1n, 0), "-1{gs}23{gs}45{gs}678");

    assert.strictEqual(f(1n, 9), "1{gs}23{gs}45{gs}678{ds}000000000");
    assert.strictEqual(f(10n, 9), "12{gs}34{gs}567{ds}800000000");
    assert.strictEqual(f(100n, 9), "1{gs}23{gs}456{ds}780000000");
    assert.strictEqual(f(1000n, 9), "12{gs}345{ds}678000000");
    assert.strictEqual(f(10000n, 9), "1{gs}234{ds}567800000");
    assert.strictEqual(f(100000n, 9), "123{ds}456780000");
    assert.strictEqual(f(1000000n, 9), "12{ds}345678000");
    assert.strictEqual(f(10000000n, 9), "1{ds}234567800");
    assert.strictEqual(f(100000000n, 9), "0{ds}123456780");
    assert.strictEqual(f(1000000000n, 9), "0{ds}012345678");
    assert.strictEqual(f(-1n, 9), "-1{gs}23{gs}45{gs}678{ds}000000000");
    assert.strictEqual(f(-10n, 9), "-12{gs}34{gs}567{ds}800000000");
    assert.strictEqual(f(-100n, 9), "-1{gs}23{gs}456{ds}780000000");
    assert.strictEqual(f(-1000n, 9), "-12{gs}345{ds}678000000");
    assert.strictEqual(f(-10000n, 9), "-1{gs}234{ds}567800000");
    assert.strictEqual(f(-100000n, 9), "-123{ds}456780000");
    assert.strictEqual(f(-1000000n, 9), "-12{ds}345678000");
    assert.strictEqual(f(-10000000n, 9), "-1{ds}234567800");
    assert.strictEqual(f(-100000000n, 9), "-0{ds}123456780");
    assert.strictEqual(f(-1000000000n, 9), "-0{ds}012345678");
  });

  it("handles comprehensive test cases as expected");
});
