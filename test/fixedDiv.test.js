import { BigAmount } from "../dist/index.js";
import { runTestOnPairs, rounded } from "./util/cases.js";

describe("#fixedDiv()", () => {
  it("returns the same fraction as `#div()` + `#quantize()`", () => {
    const THRESH = 0.5; // threshold to randomly cut down test cases
    runTestOnPairs((xn, xd) => {
      if (Math.random() < THRESH) {
        return;
      }
      const left = new BigAmount(xn, xd);
      runTestOnPairs((yn, yd) => {
        if (Math.random() < THRESH) {
          return;
        } else if (yn === 0n) {
          assert.throws(() => left.fixedDiv(right));
          return;
        }
        const right = new BigAmount(yn, yd);
        const expected = left.div(right).quantize(left.den);
        const actual = left.fixedDiv(right);
        assert.strictEqual(actual.num, expected.num);
        assert.strictEqual(actual.den, expected.den);
      });
    });
  });

  it("rounds the numerator as expected (test [-5.0, 5.0])", () => {
    const { input, expected } = rounded;
    const len = input.length;

    const test = (num, oldDen, newDen, expected) => {
      if (num === 0n) {
        assert.throws(() =>
          new BigAmount(newDen, newDen).fixedDiv(new BigAmount(oldDen, num)),
        );
        return;
      }
      assert.strictEqual(
        new BigAmount(newDen, newDen).fixedDiv(new BigAmount(oldDen, num)).num,
        expected,
      );
    };

    for (let i = 0; i < input.length; i++) {
      test(input[i], 10n, 1n, expected["HALF_EVEN"][i]);
      test(input[i], -10n, -1n, expected["HALF_EVEN"][i]);

      test(input[i], 10n, -1n, expected["HALF_EVEN"][len - i - 1]);
      test(input[i], -10n, 1n, expected["HALF_EVEN"][len - i - 1]);
    }

    const testWithMode = (num, oldDen, newDen, mode, expected) => {
      if (num === 0n) {
        assert.throws(() =>
          new BigAmount(newDen, newDen).fixedDiv(
            new BigAmount(oldDen, num),
            mode,
          ),
        );
        return;
      }
      assert.strictEqual(
        new BigAmount(newDen, newDen).fixedDiv(new BigAmount(oldDen, num), mode)
          .num,
        expected,
      );
    };

    for (const mode of Object.keys(expected)) {
      for (let i = 0; i < input.length; i++) {
        testWithMode(input[i], 10n, 1n, mode, expected[mode][i]);
        testWithMode(input[i], -10n, -1n, mode, expected[mode][i]);

        testWithMode(input[i], 10n, -1n, mode, expected[mode][len - i - 1]);
        testWithMode(input[i], -10n, 1n, mode, expected[mode][len - i - 1]);
      }
    }
  });
});
