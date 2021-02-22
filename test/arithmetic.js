import { BigAmount } from "../lib/index.js";
import { pairs as cases } from "./util/cases.js";
const assert = chai.assert;

describe("#neg()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      const expected = new BigAmount(-xn, xd);
      assert(new BigAmount(xn, xd).neg().eq(expected));
    };

    for (const [xn, xd] of cases) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});

describe("#abs()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      const expected = new BigAmount(xn < 0n ? -xn : xn, xd < 0n ? -xd : xd);
      assert(new BigAmount(xn, xd).abs().eq(expected));
    };

    for (const [xn, xd] of cases) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});

describe("#inv()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd) => {
      if (xn !== 0n) {
        const expected = new BigAmount(xd, xn);
        assert(new BigAmount(xn, xd).inv().eq(expected));
      } else {
        assert.throws(() => new BigAmount(xn, xd).inv());
      }
    };

    for (const [xn, xd] of cases) {
      test(xn, xd);
      test(-xn, xd);
      test(xn, -xd);
      test(-xn, -xd);
    }
  });
});

describe("#add()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const expected = new BigAmount(xn * yd + yn * xd, xd * yd);
      assert(new BigAmount(xn, xd).add(new BigAmount(yn, yd)).eq(expected));
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        test(xn, xd, yn, yd);
        test(-xn, xd, -yn, yd);
        test(xn, -xd, yn, -yd);
        test(-xn, -xd, -yn, -yd);
      }
    }
  });

  it("should not change the denominator if `other` has the same one", () => {
    const test = (xn, xd, yn, yd) => {
      const result = new BigAmount(xn, xd).add(new BigAmount(yn, yd));
      assert.strictEqual(result.den, xd);
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        if (xd === yd) {
          test(xn, xd, yn, yd);
          test(-xn, xd, -yn, yd);
          test(xn, -xd, yn, -yd);
          test(-xn, -xd, -yn, -yd);
        }
      }
    }
  });
});

describe("#sub()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const expected = new BigAmount(xn * yd - yn * xd, xd * yd);
      assert(new BigAmount(xn, xd).sub(new BigAmount(yn, yd)).eq(expected));
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        test(xn, xd, yn, yd);
        test(-xn, xd, -yn, yd);
        test(xn, -xd, yn, -yd);
        test(-xn, -xd, -yn, -yd);
      }
    }
  });

  it("should not change the denominator if `other` has the same one", () => {
    const test = (xn, xd, yn, yd) => {
      const result = new BigAmount(xn, xd).sub(new BigAmount(yn, yd));
      assert.strictEqual(result.den, xd);
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        if (xd === yd) {
          test(xn, xd, yn, yd);
          test(-xn, xd, -yn, yd);
          test(xn, -xd, yn, -yd);
          test(-xn, -xd, -yn, -yd);
        }
      }
    }
  });
});

describe("#mul()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const expected = new BigAmount(xn * yn, xd * yd);
      assert(new BigAmount(xn, xd).mul(new BigAmount(yn, yd)).eq(expected));
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        test(xn, xd, yn, yd);
        test(-xn, xd, -yn, yd);
        test(xn, -xd, yn, -yd);
        test(-xn, -xd, -yn, -yd);
      }
    }
  });
});

describe("#div()", () => {
  it("should produce an equivalent fraction to what the naive algorithm does", () => {
    const test = (xn, xd, yn, yd) => {
      const den = xd * yn;
      if (den !== 0n) {
        const expected = new BigAmount(xn * yd, den);
        assert(new BigAmount(xn, xd).div(new BigAmount(yn, yd)).eq(expected));
      } else {
        assert.throws(() => new BigAmount(xn, xd).div(new BigAmount(yn, yd)));
      }
    };

    for (const [xn, xd] of cases) {
      for (const [yn, yd] of cases) {
        test(xn, xd, yn, yd);
        test(-xn, xd, -yn, yd);
        test(xn, -xd, yn, -yd);
        test(-xn, -xd, -yn, -yd);
      }
    }
  });
});
