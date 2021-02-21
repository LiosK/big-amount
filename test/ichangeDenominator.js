import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

describe("#ichangeDenominator()", () => {
  it("should change the denominator", () => {
    const cases = [10n, 25n, 34n, 117n, 429393759437859340759378n];

    const test = (num, oldDen, newDen) => {
      assert.strictEqual(
        new BigAmount(num, oldDen).ichangeDenominator(newDen).denominator(),
        newDen
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

  it("should return an equivalent fraction if no rounding is necessary", () => {
    const cases = [
      [0n, 1n, 100n],
      [12n, 24n, 1440n],
      [43n, 73n, 876n],
      [12n, 24n, 10n],
      [903n, 876n, 292n],
    ];

    const test = (num, oldDen, newDen) => {
      const original = new BigAmount(num, oldDen);
      assert(original.clone().ichangeDenominator(newDen).eq(original));
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

  it("should round the numerator as expected (test [-50, 50])", () => {
    const input = [];
    for (let n = -50n; n <= 50n; n++) {
      input.push(n);
    }

    const expected = {
      UP: [
        /// {{{
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        // }}}
      ],
      DOWN: [
        /// {{{
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        // }}}
      ],
      CEIL: [
        /// {{{
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        // }}}
      ],
      FLOOR: [
        /// {{{
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        // }}}
      ],
      HALF_UP: [
        /// {{{
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        5n,
        5n,
        5n,
        5n,
        5n,
        // }}}
      ],
      HALF_EVEN: [
        /// {{{
        -5n,
        -5n,
        -5n,
        -5n,
        -5n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -4n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -3n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -2n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        -1n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        1n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        2n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        3n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        4n,
        5n,
        5n,
        5n,
        5n,
        5n,
        // }}}
      ],
    };

    const len = input.length;

    const test = (num, oldDen, newDen, expected) => {
      assert.strictEqual(
        new BigAmount(num, oldDen).ichangeDenominator(newDen).numerator(),
        expected
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
        new BigAmount(num, oldDen).ichangeDenominator(newDen, mode).numerator(),
        expected
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

// vim: fdm=marker fmr&
