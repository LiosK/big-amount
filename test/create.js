import { BigAmount } from "../dist/index.js";
const assert = chai.assert;

describe("create(x)", () => {
  it("creates the expected representaion of a fraction", () => {
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
      [[123n, 456n], new BigAmount(123n, 456n)],
      [[-123n, 456n], new BigAmount(-123n, 456n)],
      [[123, 456], new BigAmount(123n, 456n)],
      [[-123, 456], new BigAmount(-123n, 456n)],
      [["123", "456"], new BigAmount(123n, 456n)],
      [["-123", "456"], new BigAmount(-123n, 456n)],
      [["123.0", "456.0"], new BigAmount(12300n, 45600n)],
      [["-123.0", "456.0"], new BigAmount(-12300n, 45600n)],
      [["1230/10", "4560/10"], new BigAmount(12300n, 45600n)],
      [["-1230/10", "4560/10"], new BigAmount(-12300n, 45600n)],
      [["123/2", "456.0/-5"], new BigAmount(-6150n, 9120n)],
      [new BigAmount(123n, 456n), new BigAmount(123n, 456n)],
      [new BigAmount(-123n, 456n), new BigAmount(-123n, 456n)],
      [{ num: 123n, den: 456n, ignored: 0 }, new BigAmount(123n, 456n)],
      [{ num: -123n, den: 456n, ignored: 0 }, new BigAmount(-123n, 456n)],
      [{ num: 123, den: 456, ignored: 0 }, new BigAmount(123n, 456n)],
      [{ num: -123, den: 456, ignored: 0 }, new BigAmount(-123n, 456n)],
      [{ num: "123", den: "456", ignored: 0 }, new BigAmount(123n, 456n)],
      [{ num: "-123", den: "456", ignored: 0 }, new BigAmount(-123n, 456n)],
      [{ num: "123.0", den: "456.0" }, new BigAmount(12300n, 45600n)],
      [{ num: "-123.0", den: "456.0" }, new BigAmount(-12300n, 45600n)],
      [{ num: "1230/10", den: "4560/10" }, new BigAmount(12300n, 45600n)],
      [{ num: "-1230/10", den: "4560/10" }, new BigAmount(-12300n, 45600n)],
      [{ num: "123/2", den: "456.0/-5" }, new BigAmount(-6150n, 9120n)],
      // }}}
    ];
    for (const [x, expected] of cases) {
      assert.deepStrictEqual(BigAmount.create(x), expected);
    }
  });
});

describe("create(x, y)", () => {
  it("creates the expected representaion of a fraction", () => {
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

// vim: fdm=marker fmr&
