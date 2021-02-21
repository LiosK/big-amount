import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

const cases = [
  // {{{
  [0n, 1n],
  [0n, 2n],
  [0n, 3n],
  [0n, 4n],
  [0n, 5n],
  [0n, 6n],
  [0n, 7n],
  [0n, 8n],
  [0n, 9n],
  [0n, 10n],
  [0n, 11n],
  [0n, 12n],
  [0n, 13n],
  [0n, 14n],
  [0n, 15n],
  [0n, 16n],
  [0n, 17n],
  [0n, 18n],
  [0n, 19n],
  [0n, 20n],
  [0n, 21n],
  [0n, 22n],
  [0n, 23n],
  [1n, 1n],
  [1n, 2n],
  [1n, 3n],
  [1n, 4n],
  [1n, 5n],
  [1n, 6n],
  [1n, 7n],
  [1n, 8n],
  [1n, 9n],
  [1n, 10n],
  [1n, 11n],
  [1n, 12n],
  [1n, 13n],
  [1n, 14n],
  [1n, 15n],
  [1n, 16n],
  [1n, 17n],
  [1n, 18n],
  [1n, 19n],
  [1n, 20n],
  [1n, 21n],
  [1n, 22n],
  [1n, 23n],
  [2n, 1n],
  [2n, 2n],
  [2n, 3n],
  [2n, 4n],
  [2n, 5n],
  [2n, 6n],
  [2n, 7n],
  [2n, 8n],
  [2n, 9n],
  [2n, 10n],
  [2n, 11n],
  [2n, 12n],
  [2n, 13n],
  [2n, 14n],
  [2n, 15n],
  [2n, 16n],
  [2n, 17n],
  [2n, 18n],
  [2n, 19n],
  [2n, 20n],
  [2n, 21n],
  [2n, 22n],
  [2n, 23n],
  [3n, 1n],
  [3n, 2n],
  [3n, 3n],
  [3n, 4n],
  [3n, 5n],
  [3n, 6n],
  [3n, 7n],
  [3n, 8n],
  [3n, 9n],
  [3n, 10n],
  [3n, 11n],
  [3n, 12n],
  [3n, 13n],
  [3n, 14n],
  [3n, 15n],
  [3n, 16n],
  [3n, 17n],
  [3n, 18n],
  [3n, 19n],
  [3n, 20n],
  [3n, 21n],
  [3n, 22n],
  [3n, 23n],
  [4n, 1n],
  [4n, 2n],
  [4n, 3n],
  [4n, 4n],
  [4n, 5n],
  [4n, 6n],
  [4n, 7n],
  [4n, 8n],
  [4n, 9n],
  [4n, 10n],
  [4n, 11n],
  [4n, 12n],
  [4n, 13n],
  [4n, 14n],
  [4n, 15n],
  [4n, 16n],
  [4n, 17n],
  [4n, 18n],
  [4n, 19n],
  [4n, 20n],
  [4n, 21n],
  [4n, 22n],
  [4n, 23n],
  [5n, 1n],
  [5n, 2n],
  [5n, 3n],
  [5n, 4n],
  [5n, 5n],
  [5n, 6n],
  [5n, 7n],
  [5n, 8n],
  [5n, 9n],
  [5n, 10n],
  [5n, 11n],
  [5n, 12n],
  [5n, 13n],
  [5n, 14n],
  [5n, 15n],
  [5n, 16n],
  [5n, 17n],
  [5n, 18n],
  [5n, 19n],
  [5n, 20n],
  [5n, 21n],
  [5n, 22n],
  [5n, 23n],
  [6n, 1n],
  [6n, 2n],
  [6n, 3n],
  [6n, 4n],
  [6n, 5n],
  [6n, 6n],
  [6n, 7n],
  [6n, 8n],
  [6n, 9n],
  [6n, 10n],
  [6n, 11n],
  [6n, 12n],
  [6n, 13n],
  [6n, 14n],
  [6n, 15n],
  [6n, 16n],
  [6n, 17n],
  [6n, 18n],
  [6n, 19n],
  [6n, 20n],
  [6n, 21n],
  [6n, 22n],
  [6n, 23n],
  [7n, 1n],
  [7n, 2n],
  [7n, 3n],
  [7n, 4n],
  [7n, 5n],
  [7n, 6n],
  [7n, 7n],
  [7n, 8n],
  [7n, 9n],
  [7n, 10n],
  [7n, 11n],
  [7n, 12n],
  [7n, 13n],
  [7n, 14n],
  [7n, 15n],
  [7n, 16n],
  [7n, 17n],
  [7n, 18n],
  [7n, 19n],
  [7n, 20n],
  [7n, 21n],
  [7n, 22n],
  [7n, 23n],
  [8n, 1n],
  [8n, 2n],
  [8n, 3n],
  [8n, 4n],
  [8n, 5n],
  [8n, 6n],
  [8n, 7n],
  [8n, 8n],
  [8n, 9n],
  [8n, 10n],
  [8n, 11n],
  [8n, 12n],
  [8n, 13n],
  [8n, 14n],
  [8n, 15n],
  [8n, 16n],
  [8n, 17n],
  [8n, 18n],
  [8n, 19n],
  [8n, 20n],
  [8n, 21n],
  [8n, 22n],
  [8n, 23n],
  [9n, 1n],
  [9n, 2n],
  [9n, 3n],
  [9n, 4n],
  [9n, 5n],
  [9n, 6n],
  [9n, 7n],
  [9n, 8n],
  [9n, 9n],
  [9n, 10n],
  [9n, 11n],
  [9n, 12n],
  [9n, 13n],
  [9n, 14n],
  [9n, 15n],
  [9n, 16n],
  [9n, 17n],
  [9n, 18n],
  [9n, 19n],
  [9n, 20n],
  [9n, 21n],
  [9n, 22n],
  [9n, 23n],
  [10n, 1n],
  [10n, 2n],
  [10n, 3n],
  [10n, 4n],
  [10n, 5n],
  [10n, 6n],
  [10n, 7n],
  [10n, 8n],
  [10n, 9n],
  [10n, 10n],
  [10n, 11n],
  [10n, 12n],
  [10n, 13n],
  [10n, 14n],
  [10n, 15n],
  [10n, 16n],
  [10n, 17n],
  [10n, 18n],
  [10n, 19n],
  [10n, 20n],
  [10n, 21n],
  [10n, 22n],
  [10n, 23n],
  [11n, 1n],
  [11n, 2n],
  [11n, 3n],
  [11n, 4n],
  [11n, 5n],
  [11n, 6n],
  [11n, 7n],
  [11n, 8n],
  [11n, 9n],
  [11n, 10n],
  [11n, 11n],
  [11n, 12n],
  [11n, 13n],
  [11n, 14n],
  [11n, 15n],
  [11n, 16n],
  [11n, 17n],
  [11n, 18n],
  [11n, 19n],
  [11n, 20n],
  [11n, 21n],
  [11n, 22n],
  [11n, 23n],
  [12n, 1n],
  [12n, 2n],
  [12n, 3n],
  [12n, 4n],
  [12n, 5n],
  [12n, 6n],
  [12n, 7n],
  [12n, 8n],
  [12n, 9n],
  [12n, 10n],
  [12n, 11n],
  [12n, 12n],
  [12n, 13n],
  [12n, 14n],
  [12n, 15n],
  [12n, 16n],
  [12n, 17n],
  [12n, 18n],
  [12n, 19n],
  [12n, 20n],
  [12n, 21n],
  [12n, 22n],
  [12n, 23n],
  [13n, 1n],
  [13n, 2n],
  [13n, 3n],
  [13n, 4n],
  [13n, 5n],
  [13n, 6n],
  [13n, 7n],
  [13n, 8n],
  [13n, 9n],
  [13n, 10n],
  [13n, 11n],
  [13n, 12n],
  [13n, 13n],
  [13n, 14n],
  [13n, 15n],
  [13n, 16n],
  [13n, 17n],
  [13n, 18n],
  [13n, 19n],
  [13n, 20n],
  [13n, 21n],
  [13n, 22n],
  [13n, 23n],
  [14n, 1n],
  [14n, 2n],
  [14n, 3n],
  [14n, 4n],
  [14n, 5n],
  [14n, 6n],
  [14n, 7n],
  [14n, 8n],
  [14n, 9n],
  [14n, 10n],
  [14n, 11n],
  [14n, 12n],
  [14n, 13n],
  [14n, 14n],
  [14n, 15n],
  [14n, 16n],
  [14n, 17n],
  [14n, 18n],
  [14n, 19n],
  [14n, 20n],
  [14n, 21n],
  [14n, 22n],
  [14n, 23n],
  [15n, 1n],
  [15n, 2n],
  [15n, 3n],
  [15n, 4n],
  [15n, 5n],
  [15n, 6n],
  [15n, 7n],
  [15n, 8n],
  [15n, 9n],
  [15n, 10n],
  [15n, 11n],
  [15n, 12n],
  [15n, 13n],
  [15n, 14n],
  [15n, 15n],
  [15n, 16n],
  [15n, 17n],
  [15n, 18n],
  [15n, 19n],
  [15n, 20n],
  [15n, 21n],
  [15n, 22n],
  [15n, 23n],
  [16n, 1n],
  [16n, 2n],
  [16n, 3n],
  [16n, 4n],
  [16n, 5n],
  [16n, 6n],
  [16n, 7n],
  [16n, 8n],
  [16n, 9n],
  [16n, 10n],
  [16n, 11n],
  [16n, 12n],
  [16n, 13n],
  [16n, 14n],
  [16n, 15n],
  [16n, 16n],
  [16n, 17n],
  [16n, 18n],
  [16n, 19n],
  [16n, 20n],
  [16n, 21n],
  [16n, 22n],
  [16n, 23n],
  [17n, 1n],
  [17n, 2n],
  [17n, 3n],
  [17n, 4n],
  [17n, 5n],
  [17n, 6n],
  [17n, 7n],
  [17n, 8n],
  [17n, 9n],
  [17n, 10n],
  [17n, 11n],
  [17n, 12n],
  [17n, 13n],
  [17n, 14n],
  [17n, 15n],
  [17n, 16n],
  [17n, 17n],
  [17n, 18n],
  [17n, 19n],
  [17n, 20n],
  [17n, 21n],
  [17n, 22n],
  [17n, 23n],
  [18n, 1n],
  [18n, 2n],
  [18n, 3n],
  [18n, 4n],
  [18n, 5n],
  [18n, 6n],
  [18n, 7n],
  [18n, 8n],
  [18n, 9n],
  [18n, 10n],
  [18n, 11n],
  [18n, 12n],
  [18n, 13n],
  [18n, 14n],
  [18n, 15n],
  [18n, 16n],
  [18n, 17n],
  [18n, 18n],
  [18n, 19n],
  [18n, 20n],
  [18n, 21n],
  [18n, 22n],
  [18n, 23n],
  [19n, 1n],
  [19n, 2n],
  [19n, 3n],
  [19n, 4n],
  [19n, 5n],
  [19n, 6n],
  [19n, 7n],
  [19n, 8n],
  [19n, 9n],
  [19n, 10n],
  [19n, 11n],
  [19n, 12n],
  [19n, 13n],
  [19n, 14n],
  [19n, 15n],
  [19n, 16n],
  [19n, 17n],
  [19n, 18n],
  [19n, 19n],
  [19n, 20n],
  [19n, 21n],
  [19n, 22n],
  [19n, 23n],
  [20n, 1n],
  [20n, 2n],
  [20n, 3n],
  [20n, 4n],
  [20n, 5n],
  [20n, 6n],
  [20n, 7n],
  [20n, 8n],
  [20n, 9n],
  [20n, 10n],
  [20n, 11n],
  [20n, 12n],
  [20n, 13n],
  [20n, 14n],
  [20n, 15n],
  [20n, 16n],
  [20n, 17n],
  [20n, 18n],
  [20n, 19n],
  [20n, 20n],
  [20n, 21n],
  [20n, 22n],
  [20n, 23n],
  [21n, 1n],
  [21n, 2n],
  [21n, 3n],
  [21n, 4n],
  [21n, 5n],
  [21n, 6n],
  [21n, 7n],
  [21n, 8n],
  [21n, 9n],
  [21n, 10n],
  [21n, 11n],
  [21n, 12n],
  [21n, 13n],
  [21n, 14n],
  [21n, 15n],
  [21n, 16n],
  [21n, 17n],
  [21n, 18n],
  [21n, 19n],
  [21n, 20n],
  [21n, 21n],
  [21n, 22n],
  [21n, 23n],
  [22n, 1n],
  [22n, 2n],
  [22n, 3n],
  [22n, 4n],
  [22n, 5n],
  [22n, 6n],
  [22n, 7n],
  [22n, 8n],
  [22n, 9n],
  [22n, 10n],
  [22n, 11n],
  [22n, 12n],
  [22n, 13n],
  [22n, 14n],
  [22n, 15n],
  [22n, 16n],
  [22n, 17n],
  [22n, 18n],
  [22n, 19n],
  [22n, 20n],
  [22n, 21n],
  [22n, 22n],
  [22n, 23n],
  [23n, 1n],
  [23n, 2n],
  [23n, 3n],
  [23n, 4n],
  [23n, 5n],
  [23n, 6n],
  [23n, 7n],
  [23n, 8n],
  [23n, 9n],
  [23n, 10n],
  [23n, 11n],
  [23n, 12n],
  [23n, 13n],
  [23n, 14n],
  [23n, 15n],
  [23n, 16n],
  [23n, 17n],
  [23n, 18n],
  [23n, 19n],
  [23n, 20n],
  [23n, 21n],
  [23n, 22n],
  [23n, 23n],
  [943164963951255357895614873723383319n, 739198868722535478624n],
  [577720682633n, 4556755653068000774490249836905n],
  [6225036170761081643482101904444n, 192806953778865696204115998508715773176n],
  [3879638328284020621n, 171846522842039n],
  [3681749165n, 303161270095384979861659681252114820141n],
  [3815637032934217624482n, 14720610852883183106n],
  [307470877656114006694381780884598252167n, 445074742373n],
  [274239108217142460813118614n, 732012477793715578206166380099271n],
  // }}}
];

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

// vim: fdm=marker fmr&
