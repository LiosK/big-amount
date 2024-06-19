import { BigAmount } from "../dist/index.js";
import { reduced } from "./util/cases.js";

describe("#eq()", () => {
  it("returns true if two instances are equivalent", () => {
    const cases = [
      [0n, 1n, 0n, 100n],
      [10n, 10n, 200n, 200n],
      [12n, 24n, 720n, 1440n],
      [43n, 73n, 516n, 876n],
    ];
    for (const [xnum, xden, ynum, yden] of cases) {
      assert(new BigAmount(xnum, xden).eq(new BigAmount(ynum, yden)));
      assert(new BigAmount(-xnum, xden).eq(new BigAmount(-ynum, yden)));
      assert(new BigAmount(xnum, -xden).eq(new BigAmount(ynum, -yden)));
      assert(new BigAmount(-xnum, -xden).eq(new BigAmount(-ynum, -yden)));

      assert(new BigAmount(ynum, yden).eq(new BigAmount(xnum, xden)));
      assert(new BigAmount(-ynum, yden).eq(new BigAmount(-xnum, xden)));
      assert(new BigAmount(ynum, -yden).eq(new BigAmount(xnum, -xden)));
      assert(new BigAmount(-ynum, -yden).eq(new BigAmount(-xnum, -xden)));
    }
  });

  it("returns false if two instances are not equivalent", () => {
    const cases = [
      [0n, 1n, 1n, 100n],
      [10n, 10n, 201n, 200n],
      [12n, 24n, 721n, 1440n],
      [43n, 73n, 517n, 876n],
    ];
    for (const [xnum, xden, ynum, yden] of cases) {
      assert(!new BigAmount(xnum, xden).eq(new BigAmount(ynum, yden)));
      assert(!new BigAmount(-xnum, xden).eq(new BigAmount(-ynum, yden)));
      assert(!new BigAmount(xnum, -xden).eq(new BigAmount(ynum, -yden)));
      assert(!new BigAmount(-xnum, -xden).eq(new BigAmount(-ynum, -yden)));

      assert(!new BigAmount(ynum, yden).eq(new BigAmount(xnum, xden)));
      assert(!new BigAmount(-ynum, yden).eq(new BigAmount(-xnum, xden)));
      assert(!new BigAmount(ynum, -yden).eq(new BigAmount(xnum, -xden)));
      assert(!new BigAmount(-ynum, -yden).eq(new BigAmount(-xnum, -xden)));
    }
  });

  it("returns true if reduced forms are the same; otherwise, return false", () => {
    const cases = reduced.map(([num, den, simplestNum, simplestDen]) => [
      `${simplestNum}/${simplestDen}`,
      new BigAmount(num, den),
      new BigAmount(-num, den),
      new BigAmount(num, -den),
      new BigAmount(-num, -den),
    ]);

    for (const x of cases) {
      for (const y of cases) {
        if (x[0] === y[0]) {
          assert(x[1].eq(y[1]));
          assert(x[2].eq(y[2]));
          assert(x[3].eq(y[3]));
          assert(x[4].eq(y[4]));
        } else {
          assert(!x[1].eq(y[1]));
          assert(!x[2].eq(y[2]));
          assert(!x[3].eq(y[3]));
          assert(!x[4].eq(y[4]));
        }
      }
    }
  });
});

describe("#ne()", () => {
  it("returns true if two instances are not equivalent", () => {
    const cases = [
      [0n, 1n, 0n, 100n],
      [10n, 10n, 200n, 200n],
      [12n, 24n, 720n, 1440n],
      [43n, 73n, 516n, 876n],
    ];
    for (const [xnum, xden, ynum, yden] of cases) {
      assert(!new BigAmount(xnum, xden).ne(new BigAmount(ynum, yden)));
      assert(!new BigAmount(-xnum, xden).ne(new BigAmount(-ynum, yden)));
      assert(!new BigAmount(xnum, -xden).ne(new BigAmount(ynum, -yden)));
      assert(!new BigAmount(-xnum, -xden).ne(new BigAmount(-ynum, -yden)));

      assert(!new BigAmount(ynum, yden).ne(new BigAmount(xnum, xden)));
      assert(!new BigAmount(-ynum, yden).ne(new BigAmount(-xnum, xden)));
      assert(!new BigAmount(ynum, -yden).ne(new BigAmount(xnum, -xden)));
      assert(!new BigAmount(-ynum, -yden).ne(new BigAmount(-xnum, -xden)));
    }
  });

  it("returns true if two instances are not equivalent", () => {
    const cases = [
      [0n, 1n, 1n, 100n],
      [10n, 10n, 201n, 200n],
      [12n, 24n, 721n, 1440n],
      [43n, 73n, 517n, 876n],
    ];
    for (const [xnum, xden, ynum, yden] of cases) {
      assert(new BigAmount(xnum, xden).ne(new BigAmount(ynum, yden)));
      assert(new BigAmount(-xnum, xden).ne(new BigAmount(-ynum, yden)));
      assert(new BigAmount(xnum, -xden).ne(new BigAmount(ynum, -yden)));
      assert(new BigAmount(-xnum, -xden).ne(new BigAmount(-ynum, -yden)));

      assert(new BigAmount(ynum, yden).ne(new BigAmount(xnum, xden)));
      assert(new BigAmount(-ynum, yden).ne(new BigAmount(-xnum, xden)));
      assert(new BigAmount(ynum, -yden).ne(new BigAmount(xnum, -xden)));
      assert(new BigAmount(-ynum, -yden).ne(new BigAmount(-xnum, -xden)));
    }
  });

  it("returns true if reduced forms are not the same; otherwise, return false", () => {
    const cases = reduced.map(([num, den, simplestNum, simplestDen]) => [
      `${simplestNum}/${simplestDen}`,
      new BigAmount(num, den),
      new BigAmount(-num, den),
      new BigAmount(num, -den),
      new BigAmount(-num, -den),
    ]);

    for (const x of cases) {
      for (const y of cases) {
        if (x[0] === y[0]) {
          assert(!x[1].ne(y[1]));
          assert(!x[2].ne(y[2]));
          assert(!x[3].ne(y[3]));
          assert(!x[4].ne(y[4]));
        } else {
          assert(x[1].ne(y[1]));
          assert(x[2].ne(y[2]));
          assert(x[3].ne(y[3]));
          assert(x[4].ne(y[4]));
        }
      }
    }
  });
});

const runOnCmpCases = (test) => {
  const cases = [
    // {{{
    [1n, 2n, 2n, 4n, 0],
    [1n, 2n, 1n, 3n, 1],
    [3n, 7n, 7n, 11n, -1],
    [-1n, 2n, 2n, 4n, -1],
    [-1n, 2n, 1n, 3n, -1],
    [-3n, 7n, 7n, 11n, -1],
    [1n, 2n, -2n, 4n, 1],
    [1n, 2n, -1n, 3n, 1],
    [3n, 7n, -7n, 11n, 1],

    [2n, 1n, 4n, 2n, 0],
    [2n, 1n, 3n, 1n, -1],
    [7n, 3n, 11n, 7n, 1],
    [2n, -1n, 4n, 2n, -1],
    [2n, -1n, 3n, 1n, -1],
    [7n, -3n, 11n, 7n, -1],
    [2n, 1n, 4n, -2n, 1],
    [2n, 1n, 3n, -1n, 1],
    [7n, 3n, 11n, -7n, 1],
    // }}}
  ];

  for (const [xn, xd, yn, yd, cmp] of cases) {
    test(xn, xd, yn, yd, cmp);
    test(-xn, xd, -yn, yd, -cmp);
    test(xn, -xd, yn, -yd, -cmp);
    test(-xn, -xd, -yn, -yd, cmp);

    test(yn, yd, xn, xd, -cmp);
    test(-yn, yd, -xn, xd, cmp);
    test(yn, -yd, xn, -xd, cmp);
    test(-yn, -yd, -xn, -xd, -cmp);
  }
};

describe("cmp()", () => {
  it("compares manually prepared cases properly", () => {
    runOnCmpCases((xn, xd, yn, yd, cmp) => {
      assert.strictEqual(new BigAmount(xn, xd).cmp(new BigAmount(yn, yd)), cmp);
    });
  });
});

describe("#gt()", () => {
  it("compares manually prepared cases properly", () => {
    runOnCmpCases((xn, xd, yn, yd, cmp) => {
      assert.strictEqual(
        new BigAmount(xn, xd).gt(new BigAmount(yn, yd)),
        cmp > 0,
      );
    });
  });
});

describe("#ge()", () => {
  it("compares manually prepared cases properly", () => {
    runOnCmpCases((xn, xd, yn, yd, cmp) => {
      assert.strictEqual(
        new BigAmount(xn, xd).ge(new BigAmount(yn, yd)),
        cmp >= 0,
      );
    });
  });
});

describe("#lt()", () => {
  it("compares manually prepared cases properly", () => {
    runOnCmpCases((xn, xd, yn, yd, cmp) => {
      assert.strictEqual(
        new BigAmount(xn, xd).lt(new BigAmount(yn, yd)),
        cmp < 0,
      );
    });
  });
});

describe("#le()", () => {
  it("compares manually prepared cases properly", () => {
    runOnCmpCases((xn, xd, yn, yd, cmp) => {
      assert.strictEqual(
        new BigAmount(xn, xd).le(new BigAmount(yn, yd)),
        cmp <= 0,
      );
    });
  });
});

// vim: fdm=marker fmr&
