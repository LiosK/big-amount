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
          n.toExponential(i),
        );
      }
    });
  });

  it("produces precise representation of repeating decimal even when ndigits is large", () => {
    const cases = [
      // {{{
      [1n, 9n, /^1\.1+e-1$/],
      [1n, 3n, /^3\.3+e-1$/],
      [2n, 3n, /^6\.6*7e-1$/],
      [9n, 11n, /^8\.(?:18)*2?e-1$/],
      [7n, 12n, /^5\.83*e-1$/],
      [1n, 7n, /^1\.(?:428571)*(?:4|43|429|4286|42857)?e-1$/],
      [1n, 81n, /^1\.(234567901)*(?:2|235?|2346|23457|234568|23456790?)?e-2$/],
      [22n, 7n, /^3\.(?:142857)*(?:1|14|143|1429|14286)?e\+0$/],
      // }}}
    ];

    for (const [p, q, pattern] of cases) {
      const f = new BigAmount(p, q);
      for (let i = 1; i < 512; i++) {
        const s = f.toExponential(i);
        assert.strictEqual(s.length, i + 5);
        assert.match(s, pattern);
      }
    }
  });
});

// vim: fdm=marker fmr&
