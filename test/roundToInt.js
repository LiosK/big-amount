import { BigAmount } from "../dist/index.js";
import { rounded } from "./util/cases.js";
const assert = chai.assert;

describe("#roundToInt()", () => {
  it("rounds the fraction as expected (test [-5.0, 5.0])", () => {
    const { input, expected } = rounded;
    for (let i = 0; i < input.length; i++) {
      assert.strictEqual(
        new BigAmount(input[i], 10n).roundToInt(),
        expected["HALF_EVEN"][i],
      );
    }
  });
});

describe("#roundToInt(roundingMode)", () => {
  it("rounds the fraction as expected (test [-5.0, 5.0])", () => {
    const { input, expected } = rounded;
    for (const mode of Object.keys(expected)) {
      for (let i = 0; i < input.length; i++) {
        assert.strictEqual(
          new BigAmount(input[i], 10n).roundToInt(mode),
          expected[mode][i],
        );
      }
    }
  });
});
