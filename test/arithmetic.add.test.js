import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#add()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        const expected = new BigAmount(xn * yd + yn * xd, xd * yd);
        assert(left.add(new BigAmount(yn, yd)).eq(expected));
      });
    });
  });

  it("does not change the denominator if `other` has the same one", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        if (xd === yd || xd === -yd) {
          const result = left.add(new BigAmount(yn, yd));
          assert.strictEqual(result.den, xd);
        }
      });
    });
  });
});
