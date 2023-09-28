import { BigAmount } from "../dist/index.js";
import { reduced } from "./util/cases.js";
const assert = chai.assert;

const testReduce = (num, den, simplestNum, simplestDen) => {
  const amount = new BigAmount(num, den).reduce();
  assert.strictEqual(amount.num, simplestNum);
  assert.strictEqual(amount.den, simplestDen);
};

describe("#reduce()", () => {
  it("throws RangeError if den === 0n", () => {
    const cases = [0n, 1n, 16n, 60n, 499n, 4592405566036505920048306074088604n];
    for (const n of cases) {
      assert.throws(() => new BigAmount(n, 0n).reduce(), RangeError);
      assert.throws(() => new BigAmount(-n, 0n).reduce(), RangeError);
    }
  });

  it("normalizes zero to 0/1", () => {
    const cases = [1n, 16n, 60n, 499n, 4592405566036505920048306074088604n];
    for (const n of cases) {
      testReduce(0n, n, 0n, 1n);
      testReduce(0n, -n, 0n, 1n);
    }
  });

  it("produces the correct irreducible representation", () => {
    for (const [x, y, simplestX, simplestY] of reduced) {
      testReduce(x, y, simplestX, simplestY);
      testReduce(x, -y, -simplestX, simplestY);
      testReduce(-x, y, -simplestX, simplestY);
      testReduce(-x, -y, simplestX, simplestY);

      testReduce(y, x, simplestY, simplestX);
      testReduce(y, -x, -simplestY, simplestX);
      testReduce(-y, x, -simplestY, simplestX);
      testReduce(-y, -x, simplestY, simplestX);
    }
    for (let [x, y, simplestX, simplestY] of reduced) {
      x *= 499n;
      y *= 499n;
      testReduce(x, y, simplestX, simplestY);
      testReduce(x, -y, -simplestX, simplestY);
      testReduce(-x, y, -simplestX, simplestY);
      testReduce(-x, -y, simplestX, simplestY);

      testReduce(y, x, simplestY, simplestX);
      testReduce(y, -x, -simplestY, simplestX);
      testReduce(-y, x, -simplestY, simplestX);
      testReduce(-y, -x, simplestY, simplestX);
    }
    for (let [x, y, simplestX, simplestY] of reduced) {
      x *= 4592405566036505920048306074088604n;
      y *= 4592405566036505920048306074088604n;
      testReduce(x, y, simplestX, simplestY);
      testReduce(x, -y, -simplestX, simplestY);
      testReduce(-x, y, -simplestX, simplestY);
      testReduce(-x, -y, simplestX, simplestY);

      testReduce(y, x, simplestY, simplestX);
      testReduce(y, -x, -simplestY, simplestX);
      testReduce(-y, x, -simplestY, simplestX);
      testReduce(-y, -x, simplestY, simplestX);
    }
  });
});
