import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

describe("#sign()", () => {
  it("should return the correct sign of a fraction", () => {
    assert.strictEqual(new BigAmount(0n, 2n).sign(), 0n);
    assert.strictEqual(new BigAmount(0n, -2n).sign(), 0n);
    assert.strictEqual(new BigAmount(1n, 2n).sign(), 1n);
    assert.strictEqual(new BigAmount(-1n, 2n).sign(), -1n);
    assert.strictEqual(new BigAmount(1n, -2n).sign(), -1n);
    assert.strictEqual(new BigAmount(-1n, -2n).sign(), 1n);
  });
});
