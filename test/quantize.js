import { BigAmount } from "../dist/index.js";
import { reduced, rounded } from "./util/cases.js";
const assert = chai.assert;

describe("#quantize()", () => {
  it("changes the denominator", () => {
    const cases = [10n, 25n, 34n, 117n, 429393759437859340759378n];

    const test = (num, oldDen, newDen) => {
      assert.strictEqual(
        new BigAmount(num, oldDen).quantize(newDen).den,
        newDen,
      );
    };

    for (const x of cases) {
      for (const y of cases) {
        for (let n = -50n; n <= 50n; n++) {
          test(n, x, y);
          test(n, -x, y);
          test(n, x, -y);
          test(n, -x, y);
          test(n, y, x);
          test(n, -y, x);
          test(n, y, -x);
          test(n, -y, -x);
        }
      }
    }
  });

  it("returns an equivalent fraction if no rounding is necessary", () => {
    const cases = [
      [0n, 1n, 100n],
      [12n, 24n, 1440n],
      [43n, 73n, 876n],
      [12n, 24n, 10n],
      [903n, 876n, 292n],
    ];

    for (const [inputP, inputQ, reducedP, reducedQ] of reduced) {
      cases.push([inputP, inputQ, reducedQ]);
      cases.push([inputQ, inputP, reducedP]);
    }

    const test = (num, oldDen, newDen) => {
      const original = new BigAmount(num, oldDen);
      assert(original.quantize(newDen).eq(original));
    };

    for (const [num, oldDen, newDen] of cases) {
      test(num, oldDen, newDen);
      test(-num, oldDen, newDen);
      test(num, -oldDen, newDen);
      test(-num, -oldDen, newDen);
      test(num, oldDen, -newDen);
      test(-num, oldDen, -newDen);
      test(num, -oldDen, -newDen);
      test(-num, -oldDen, -newDen);
    }
  });

  it("rounds the numerator as expected (test [-5.0, 5.0])", () => {
    const { input, expected } = rounded;
    const len = input.length;

    const test = (num, oldDen, newDen, expected) => {
      assert.strictEqual(
        new BigAmount(num, oldDen).quantize(newDen).num,
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
      assert.strictEqual(
        new BigAmount(num, oldDen).quantize(newDen, mode).num,
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
