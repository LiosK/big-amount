import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("#neg()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const expected = new BigAmount(-xn, xd);
      assert(new BigAmount(xn, xd).neg().eq(expected));
    });
  });
});

describe("#abs()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      const expected = new BigAmount(xn < 0n ? -xn : xn, xd < 0n ? -xd : xd);
      assert(new BigAmount(xn, xd).abs().eq(expected));
    });
  });
});

describe("#inv()", () => {
  it("produces an equivalent fraction to what the naive algorithm does", () => {
    runTestOnPairs((xn, xd) => {
      if (xn !== 0n) {
        const expected = new BigAmount(xd, xn);
        assert(new BigAmount(xn, xd).inv().eq(expected));
      } else {
        assert.throws(() => new BigAmount(xn, xd).inv());
      }
    });
  });
});
