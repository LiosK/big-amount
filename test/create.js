const assert = require("assert").strict;
const { BigAmount } = require("..");

describe("create(x)", () => {
  it("should create the expected representaion of a fraction", () => {
    const cases = [
      // {{{
      ["1/2", new BigAmount(1n, 2n)],
      ["-1/2", new BigAmount(-1n, 2n)],
      ["10/5", new BigAmount(10n, 5n)],
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
      [1, 2, new BigAmount(1n, 2n)],
      [-1, 2, new BigAmount(-1n, 2n)],
      ["10", "5", new BigAmount(10n, 5n)],
      // }}}
    ];
    for (const [x, y, expected] of cases) {
      assert.deepStrictEqual(BigAmount.create(x, y), expected);
    }
  });
});
