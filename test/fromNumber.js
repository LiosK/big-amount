import { BigAmount } from "../dist/index.js";
const assert = chai.assert;

describe("fromNumber()", () => {
  it("reasonably approximates a fraction", () => {
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

  it("determines correct p, q of p/q where p, q < 1000", () => {
    for (let p = 0; p < 1000; p++) {
      for (let q = 1; q < 1000; q++) {
        assert(
          BigAmount.fromNumber(p / q).eq(new BigAmount(BigInt(p), BigInt(q)))
        );
      }
    }
  });
});

describe("fromNumber() implemented using Farey sequences", () => {
  const generateFareySequence = (n) => {
    let [a, b, c, d] = [0, 1, 1, n];
    const result = [[a, b]];
    while (c <= n) {
      const k = Math.trunc((n + b) / d);
      [a, b, c, d] = [c, d, k * c - a, k * d - b];
      result.push([a, b]);
    }
    return result;
  };

  it("determines any term of the Farey sequence of order 1024", () => {
    for (const [p, q] of generateFareySequence(1024)) {
      assert(
        BigAmount.fromNumber(p / q).eq(new BigAmount(BigInt(p), BigInt(q)))
      );
    }
  });
});

// vim: fdm=marker fmr&
