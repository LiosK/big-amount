import { BigAmount } from "../lib/index.js";
import { rounded } from "./util/cases.js";
const assert = chai.assert;

describe("#roundToInt()", () => {
  it("should round the fraction as expected (test [-50/10, 50/10])", () => {
    const { input, expected } = rounded;
    for (let i = 0; i < input.length; i++) {
      assert.strictEqual(
        new BigAmount(input[i], 10n).roundToInt(),
        expected["HALF_EVEN"][i]
      );
    }
  });
});

describe("#roundToInt(roundingMode)", () => {
  it("should round the fraction as expected (test [-50/10, 50/10])", () => {
    const { input, expected } = rounded;
    for (const mode of Object.keys(expected)) {
      for (let i = 0; i < input.length; i++) {
        assert.strictEqual(
          new BigAmount(input[i], 10n).roundToInt(mode),
          expected[mode][i]
        );
      }
    }
  });
});
