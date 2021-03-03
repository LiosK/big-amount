import { BigAmount } from "../dist/index.js";
import { reduced, rounded } from "./util/cases.js";
const assert = chai.assert;

describe("#tryQuantize()", () => {
  it("changes the denominator", () => {
    const cases = [10n, 25n, 34n, 117n, 429393759437859340759378n];

    const test = (num, oldDen, newDen) => {
      assert.strictEqual(
        new BigAmount(num, oldDen).tryQuantize(newDen).den,
        newDen
      );
    };

    for (const x of cases) {
      for (const y of cases) {
        for (let n = -50n; n <= 50n; n++) {
          const nx = n * x;
          test(nx, x, y);
          test(nx, -x, y);
          test(nx, x, -y);
          test(nx, -x, y);

          const ny = n * y;
          test(ny, y, x);
          test(ny, -y, x);
          test(ny, y, -x);
          test(ny, -y, -x);
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
      assert(original.tryQuantize(newDen).eq(original));
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

  it("returns undefined if rounding is necessary", () => {
    const { input, expected } = rounded;
    const len = input.length;

    const test = (num, oldDen, newDen, expected) => {
      const result = new BigAmount(num, oldDen).tryQuantize(newDen);
      if (num % 10n === 0n) {
        assert.strictEqual(result.num, expected);
      } else {
        assert.strictEqual(result, void 0);
      }
    };

    for (let i = 0; i < input.length; i++) {
      test(input[i], 10n, 1n, expected["HALF_EVEN"][i]);
      test(input[i], -10n, -1n, expected["HALF_EVEN"][i]);

      test(input[i], 10n, -1n, expected["HALF_EVEN"][len - i - 1]);
      test(input[i], -10n, 1n, expected["HALF_EVEN"][len - i - 1]);
    }
  });
});
