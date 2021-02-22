import { BigAmount } from "../lib/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#sub()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        const expected = new BigAmount(xn * yd - yn * xd, xd * yd);
        assert(left.sub(new BigAmount(yn, yd)).eq(expected));
      });
    });
  });

  it("should not change the denominator if `other` has the same one", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        if (xd === yd) {
          const result = left.sub(new BigAmount(yn, yd));
          assert.strictEqual(result.den, xd);
        }
      });
    });
  });
});
