import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

describe("create(x)", () => {
  it("should create the expected representaion of a fraction", () => {
    const cases = [
      // {{{
      [83, new BigAmount(83n, 1n)],
      [-83, new BigAmount(-83n, 1n)],
      [1234n, new BigAmount(1234n, 1n)],
      [-1234n, new BigAmount(-1234n, 1n)],
      ["12", new BigAmount(12n, 1n)],
      ["-12", new BigAmount(-12n, 1n)],
      ["1/2", new BigAmount(1n, 2n)],
      ["-1/2", new BigAmount(-1n, 2n)],
      ["10/5", new BigAmount(10n, 5n)],
      ["35/-7", new BigAmount(35n, -7n)],
      ["9876.5432", new BigAmount(98765432n, 10000n)],
      ["-9876.5432", new BigAmount(-98765432n, 10000n)],
      [".0123e-2", new BigAmount(123n, 1000000n)],
      ["-.0123e-2", new BigAmount(-123n, 1000000n)],
      ["456e4", new BigAmount(4560000n, 1n)],
      ["-456e4", new BigAmount(-4560000n, 1n)],
      // }}}
    ];
    for (const [x, expected] of cases) {
      assert.deepStrictEqual(BigAmount.create(x), expected);
    }
  });
});

describe("create(x, y)", () => {
  it("should create the expected representaion of a fraction", () => {
    const cases = [
      // {{{
      [12, 24, new BigAmount(12n, 24n)],
      [-12, 24, new BigAmount(-12n, 24n)],
      [1, 2, new BigAmount(1n, 2n)],
      [-1, 2, new BigAmount(-1n, 2n)],
      ["1", "2", new BigAmount(1n, 2n)],
      ["-1", "2", new BigAmount(-1n, 2n)],
      ["10", "5", new BigAmount(10n, 5n)],
      ["35", "-7", new BigAmount(35n, -7n)],
      // }}}
    ];
    for (const [x, y, expected] of cases) {
      assert.deepStrictEqual(BigAmount.create(x, y), expected);
    }
  });
});

describe("fromNumber()", () => {
  it("should reasonably approximate a fraction", () => {
    const createCase = (n, d) => [n / d, new BigAmount(BigInt(n), BigInt(d))];
    const cases = [
      // {{{
      createCase(1, 3),
      createCase(2, 3),
      createCase(1, 4),
      createCase(1, 5),
      createCase(4, 5),
      createCase(1, 7),
      createCase(6, 7),
      createCase(1, 10),
      createCase(7, 10),
      createCase(3, 11),
      createCase(7, 19),
      createCase(17, 19),
      // }}}
    ];
    for (const [n, expected] of cases) {
      assert(BigAmount.fromNumber(n).eq(expected));
      assert(BigAmount.fromNumber(-n).eq(expected.neg()));
    }
  });
});

describe("sum()", () => {
  it("should return zero if the argument is empty", () => {
    assert(BigAmount.sum([]).eq(new BigAmount(0n, 1n)));
  });

  it("should keep the denominator unchanged if all the elements share one", () => {
    assert.deepEqual(
      BigAmount.sum([
        // {{{
        "-843729/100",
        "4627.84",
        "-443051/100",
        "8457.02",
        "-419060/100",
        "9322.89",
        "-488357/100",
        "1946.43",
        "-375021/100",
        "-9059.84",
        "-876372/100",
        "-6522.55",
        "705843/100",
        "3775.96",
        "-231272/100",
        "4150.99",
        "-775208/100",
        // }}}
      ]),
      new BigAmount(-2076353n, 100n)
    );
  });

  it("should sum the list of decimal fractions", () => {
    assert(
      BigAmount.sum([
        // {{{
        "-463.42",
        "298.322814",
        "82.75432",
        "127.8711",
        "-472.5437",
        "419.89",
        "152.08436",
        "141.278",
        "41.8776",
        "74.781378",
        "-113.7936",
        "300",
        "237.963545",
        "464.58",
        "188.197",
        "451",
        "-33",
        "345.4",
        "-351.9789",
        "-360.19545",
        // }}}
      ]).eq(new BigAmount(15310684670n, 10000000n))
    );
  });
});

// vim: fdm=marker fmr&
