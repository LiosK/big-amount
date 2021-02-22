import { BigAmount } from "../lib/index.js";
import { runTestOnPairs } from "./util/cases.js";
const assert = chai.assert;

describe("constructor()", () => {
  it("should create a BigAmount with num and den fields", () => {
    runTestOnPairs((p, q) => {
      const x = new BigAmount(p, q);
      assert(x instanceof BigAmount);
      assert.strictEqual(x.num, p);
      assert.strictEqual(x.den, q);
    });
  });

  it("should throw error if denominator is zero", () => {
    assert.throws(() => new BigAmount(0n, 0n));
    assert.throws(() => new BigAmount(1n, 0n));
    assert.throws(() => new BigAmount(-1n, 0n));
    assert.throws(() => new BigAmount(7392820129741293712731290n, 0n));
    assert.throws(() => new BigAmount(-7392820129741293712731290n, 0n));
  });
});
