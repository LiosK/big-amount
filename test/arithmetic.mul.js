import { BigAmount } from "../lib/index.js";
import { pairs } from "./util/cases.js";
const assert = chai.assert;

describe("#mul()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const expected = new BigAmount(xn * yn, xd * yd);
      assert(new BigAmount(xn, xd).mul(new BigAmount(yn, yd)).eq(expected));
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
