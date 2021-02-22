import { BigAmount } from "../lib/index.js";
import { pairs } from "./util/cases.js";
const assert = chai.assert;

describe("#add()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const expected = new BigAmount(xn * yd + yn * xd, xd * yd);
      assert(new BigAmount(xn, xd).add(new BigAmount(yn, yd)).eq(expected));
    };

    for (const [xn, xd] of pairs) {
      for (const [yn, yd] of pairs) {
        test(xn, xd, yn, yd);
        test(-xn, xd, -yn, yd);
        test(xn, -xd, yn, -yd);
        test(-xn, -xd, -yn, -yd);
      }
    }
  });

  it("should not change the denominator if `other` has the same one", () => {
    const test = (xn, xd, yn, yd) => {
      const result = new BigAmount(xn, xd).add(new BigAmount(yn, yd));
      assert.strictEqual(result.den, xd);
    };

    for (const [xn, xd] of pairs) {
      for (const [yn, yd] of pairs) {
        if (xd === yd) {
          test(xn, xd, yn, yd);
          test(-xn, xd, -yn, yd);
          test(xn, -xd, yn, -yd);
          test(-xn, -xd, -yn, -yd);
        }
      }
    }
  });
});
