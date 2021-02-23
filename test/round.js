import { BigAmount } from "../lib/index.js";
import { rounded } from "./util/cases.js";
const assert = chai.assert;

describe("#round()", () => {
  it("should round the fraction as expected (test [-5.0, 5.0])", () => {
    const { input, expected } = rounded;
    for (let i = 0; i < input.length; i++) {
      const result = new BigAmount(input[i], 10n).round();
      assert.strictEqual(result.num, expected["HALF_EVEN"][i]);
      assert.strictEqual(result.den, 1n);
    }
  });
});

describe("#round(N, roundingMode)", () => {
  it("should round the fraction as expected (test [-5.0e-N, 5.0e-N])", () => {
    const { input, expected } = rounded;
    for (const ndigits of [-24, -3, 0, 3, 24]) {
      const nTerm = 10n ** BigInt(-Math.min(0, ndigits));
      const dTerm = 10n ** BigInt(Math.max(0, ndigits));
      for (const mode of Object.keys(expected)) {
        for (let i = 0; i < input.length; i++) {
          const result = new BigAmount(input[i] * nTerm, 10n * dTerm).round(
            ndigits,
            mode
          );
          assert.strictEqual(result.num, expected[mode][i] * nTerm);
          assert.strictEqual(result.den, 1n * dTerm);
        }
      }
    }
  });
});
