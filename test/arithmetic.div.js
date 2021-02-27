import { BigAmount } from "../lib/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#div()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        if (yn !== 0n) {
          const expected = new BigAmount(xn * yd, xd * yn);
          assert(left.div(new BigAmount(yn, yd)).eq(expected));
        }
      });
    });
  });

  it("throws error if other is zero", () => {
    assert.throws(() => new BigAmount(0n, 1n).div(new BigAmount(0n, 1n)));
    assert.throws(() => new BigAmount(0n, -1n).div(new BigAmount(0n, 1n)));
    assert.throws(() => new BigAmount(1n, 2n).div(new BigAmount(0n, 1n)));
    assert.throws(() => new BigAmount(-1n, 2n).div(new BigAmount(0n, 1n)));
    assert.throws(() => new BigAmount(1n, -2n).div(new BigAmount(0n, 1n)));
    assert.throws(() => new BigAmount(-1n, -2n).div(new BigAmount(0n, 1n)));
  });
});
