import { BigAmount } from "../lib/index.js";
import { pairs } from "./util/cases.js";
const assert = chai.assert;

describe("#div()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      if (yn !== 0n) {
        const expected = new BigAmount(xn * yd, xd * yn);
        assert(new BigAmount(xn, xd).div(new BigAmount(yn, yd)).eq(expected));
      } else {
        assert.throws(() => new BigAmount(xn, xd).div(new BigAmount(yn, yd)));
      }
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
});
