import { BigAmount } from "../lib/index.js";
import { pairs } from "./util/cases.js";
const assert = chai.assert;

describe("#neg()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      const expected = new BigAmount(-xn, xd);
      assert(new BigAmount(xn, xd).neg().eq(expected));
    };

    for (const [xn, xd] of pairs) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});

describe("#abs()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      const expected = new BigAmount(xn < 0n ? -xn : xn, xd < 0n ? -xd : xd);
      assert(new BigAmount(xn, xd).abs().eq(expected));
    };

    for (const [xn, xd] of pairs) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});

describe("#inv()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      if (xn !== 0n) {
        const expected = new BigAmount(xd, xn);
        assert(new BigAmount(xn, xd).inv().eq(expected));
      } else {
        assert.throws(() => new BigAmount(xn, xd).inv());
      }
    };

    for (const [xn, xd] of pairs) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});
