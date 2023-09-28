import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#sign()", () => {
  it("returns the correct sign of a fraction", () => {
    assert.strictEqual(new BigAmount(0n, 2n).sign(), 0n);
    assert.strictEqual(new BigAmount(0n, -2n).sign(), 0n);
    assert.strictEqual(new BigAmount(1n, 2n).sign(), 1n);
    assert.strictEqual(new BigAmount(-1n, 2n).sign(), -1n);
    assert.strictEqual(new BigAmount(1n, -2n).sign(), -1n);
    assert.strictEqual(new BigAmount(-1n, -2n).sign(), 1n);
  });
});

describe("#isInteger()", () => {
  it("produces the same result as what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      assert.strictEqual(new BigAmount(xn, xd).isInteger(), xn % xd === 0n);
    });
  });
});

describe("#isZero()", () => {
  it("produces the same result as what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      assert.strictEqual(new BigAmount(xn, xd).isZero(), xn === 0n);
    });
  });
});

describe("sum()", () => {
  it("returns zero if the argument is empty", () => {
    assert(BigAmount.sum([]).eq(new BigAmount(0n, 1n)));
  });

  it("keeps the denominator unchanged if all the elements share one", () => {
    assert.deepEqual(
      BigAmount.sum([
        // {{{
        "-843729/100",
        "4627.84",
        "-443051/100",
        "8457.02",
        "-419060/100",
        "9322.89",
        "-488357/100",
        "1946.43",
        "-375021/100",
        "-9059.84",
        "-876372/100",
        "-6522.55",
        "705843/100",
        "3775.96",
        "-231272/100",
        "4150.99",
        "-775208/100",
        // }}}
      ]),
      new BigAmount(-2076353n, 100n),
    );
  });

  it("sums the list of decimal fractions", () => {
    assert(
      BigAmount.sum([
        // {{{
        "-463.42",
        "298.322814",
        "82.75432",
        "127.8711",
        "-472.5437",
        "419.89",
        "152.08436",
        "141.278",
        "41.8776",
        "74.781378",
        "-113.7936",
        "300",
        "237.963545",
        "464.58",
        "188.197",
        "451",
        "-33",
        "345.4",
        "-351.9789",
        "-360.19545",
        // }}}
      ]).eq(new BigAmount(15310684670n, 10000000n)),
    );
  });
});

// vim: fdm=marker fmr&
