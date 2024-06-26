import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";

describe("#mul()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        const expected = new BigAmount(xn * yn, xd * yd);
        assert(left.mul(new BigAmount(yn, yd)).eq(expected));
      });
    });
  });
});
