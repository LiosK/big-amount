import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#toExponential()", () => {
  it("agrees with `Number#toExponential()`, except rounding", () => {
    runTestOnPairs((xn, xd) => {
      for (let i = 0; i < 10; i += 3) {
        let n = Number(xn) / Number(xd);

        // Absorb rounding mode difference
        if (i === 0) {
          switch (Math.abs(n)) {
            case 0.25:
            case 2.5:
            case 4.5:
            case 6.5:
              n *= 0.99;
              break;
          }
        }

        assert.strictEqual(
          new BigAmount(xn, xd).toExponential(i),
          n.toExponential(i)
        );
      }
    });
  });
});
