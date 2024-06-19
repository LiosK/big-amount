import { BigAmount } from "../dist/index.js";
import { pairs } from "./util/cases.js";

describe("#batchAdd()", () => {
  it("produces an equivalent fraction to what a sequence of #add() does", () => {
    const [heads, ...tails] = pairs.map(([xn, xd]) => [
      new BigAmount(xn, xd),
      new BigAmount(-xn, xd),
      new BigAmount(xn, -xd),
      new BigAmount(-xn, -xd),
    ]);

    for (let i = 0; i < 4; i++) {
      const others = [];
      let expected = heads[i];
      for (const f of tails) {
        others.push(f[i]);
        expected = expected.add(f[i]);
      }
      assert(heads[i].batchAdd(others).eq(expected));
    }
  });

  it("does not change the denominator if `others` have the same one", () => {
    const dens = [100n, 100n, -100n, -100n];
    const [heads, ...tails] = pairs.map(([xn]) => [
      new BigAmount(xn, dens[0]),
      new BigAmount(-xn, dens[1]),
      new BigAmount(xn, dens[2]),
      new BigAmount(-xn, dens[3]),
    ]);

    for (let i = 0; i < 4; i++) {
      const others = [];
      for (const f of tails) {
        others.push(f[i]);
      }
      assert.strictEqual(heads[i].batchAdd(others).den, dens[i]);
    }
  });
});
