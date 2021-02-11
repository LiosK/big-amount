export class BigAmount {
  /** Creates a `BigAmount` without validating arguments. */
  constructor(public num: bigint, public den: bigint) {}

  /** Creates a `BigAmount`. */
  static create(
    x: BigAmount | bigint | number | string,
    y?: BigAmount | bigint | number | string
  ): BigAmount {
    // `create("x/y")` is equivalent to `create("x", "y")`
    if (typeof x === "string" && y == null) {
      const pair = x.split("/");
      if (pair.length === 2) {
        [x, y] = pair;
      }
    }

    // Convert int-like to BigInt
    const patIntLike = /^\s*(?:0b[01]+|0o[0-7]+|0x[0-9a-f]+|[-+]?[0-9]+)\s*$/i;
    if (
      (typeof x === "number" && Number.isInteger(x)) ||
      (typeof x === "string" && patIntLike.test(x))
    ) {
      x = BigInt(x);
    }
    if (
      (typeof y === "number" && Number.isInteger(y)) ||
      (typeof y === "string" && patIntLike.test(y))
    ) {
      y = BigInt(y);
    }

    if (y == null) {
      // `create(x)`
      if (x instanceof BigAmount) {
        return x.clone().verify();
      } else if (typeof x === "bigint") {
        return new BigAmount(x, 1n);
      } else if (typeof x === "number") {
        throw new RangeError(
          Number.isFinite(x)
            ? `non-integer Number value: ${x}` +
              "; pass it as a string or use `fromNumber()` instead"
            : `unsupported Number value: ${x}`
        );
      } else if (typeof x === "string") {
        // TODO parse
      }
      throw new TypeError("unsupported type: " + typeof x);
    } else {
      // `create(x, y)`
      if (typeof x === "bigint" && typeof y === "bigint") {
        // Fast track for `create(x: int-like, y: int-like)`
        return new BigAmount(x, y).verify();
      }
      return BigAmount.create(x).div(BigAmount.create(y));
    }
  }

  /**
   * Creates a `BigAmount` from `Number`. Unlike `create()`, this method finds a
   * rational approximate of non-integer finite number.
   */
  static fromNumber(x: number, precision = 100_000_000): BigAmount {
    if (Number.isInteger(x)) {
      return new BigAmount(BigInt(x), 1n);
    } else if (!Number.isFinite(x)) {
      throw new RangeError(`unsupported Number value: ${x}`);
    }

    // Approximate `x`'s coefficient and then scale it by `x`'s exponent
    const exp = Math.floor(Math.log2(Math.abs(x)));
    const coef = Math.abs(x) / Math.pow(2, exp); // being always 1.dddddd...

    let [num, den] = [1, 1]; // result if coef === 1 (i.e. x === 2 ** exp)
    if (coef !== 1) {
      // Approximate `coef` using Farey sequences (or just binary search)
      let [lnum, lden] = [1, 1];
      let [unum, uden] = [2, 1];
      let mid = 1.5;
      while (lden + uden <= precision) {
        num = lnum + unum;
        den = lden + uden;
        mid = num / den;
        if (coef === mid) {
          break;
        } else if (coef < mid) {
          unum = num;
          uden = den;
        } else {
          lnum = num;
          lden = den;
        }
      }

      if (coef < mid && coef - lnum / lden < mid - coef) {
        // lower --- coef ------------ mid
        [num, den] = [lnum, lden];
      } else if (coef > mid && unum / uden - coef < coef - mid) {
        // mid ------------ coef --- upper
        [num, den] = [unum, uden];
      }
    }

    // Return (num / den) * (2 ** exp)
    const sign = x < 0 ? -1n : 1n;
    const term = 2n ** BigInt(Math.abs(exp));
    return exp > 0
      ? new BigAmount(sign * BigInt(num) * term, BigInt(den))
      : new BigAmount(sign * BigInt(num), BigInt(den) * term);
  }

  /** Returns a copy of `this`. */
  clone(): BigAmount {
    return new BigAmount(this.num, this.den);
  }

  /**
   * Asserts that `this` is composed of `BigInt` values and the denominator is
   * non-zero.
   */
  private verify(): this {
    this.num - 0n;
    this.den - 0n;
    if (this.den === 0n) {
      throw new RangeError("denominator is zero");
    }
    return this;
  }

  /** Converts `this` to the simplest form with a positive denominator. */
  reduce(): this {
    this.verify();
    if (this.num === 0n) {
      this.den = 1n;
    } else {
      const gcd = BigIntMath.gcd(this.num, this.den);
      this.num /= gcd;
      this.den /= gcd;
      if (this.den < 0n) {
        this.num = -this.num;
        this.den = -this.den;
      }
    }
    return this;
  }

  /** Returns true if `this` is an equivalent fraction to `other`. */
  eq(other: BigAmount): boolean {
    this.verify();
    if (this.den === other.den) {
      return this.num == other.num;
    }
    return this.num * other.den === this.den * other.num;
  }

  // Arithmetic operations

  neg(): this {
    this.num = -this.num;
    return this;
  }

  abs(): this {
    this.num = BigIntMath.abs(this.num);
    this.den = BigIntMath.abs(this.den);
    return this;
  }

  inv(): this {
    const tmp = this.num;
    this.num = this.den;
    this.den = tmp;
    return this.verify();
  }

  add(other: BigAmount): this {
    if (this.den === other.den) {
      this.num += other.num;
    } else {
      this.num = this.num * other.den + other.num * this.den;
      this.den *= other.den;
    }
    return this.verify();
  }

  sub(other: BigAmount): this {
    if (this.den === other.den) {
      this.num -= other.num;
    } else {
      this.num = this.num * other.den - other.num * this.den;
      this.den *= other.den;
    }
    return this.verify();
  }

  mul(other: BigAmount): this {
    this.num *= other.num;
    this.den *= other.den;
    return this.verify();
  }

  div(other: BigAmount): this {
    this.num *= other.den;
    this.den *= other.num;
    return this.verify();
  }
}

export const Q = BigAmount.create;

/** Math utilities for BigInt */
class BigIntMath {
  static abs(x: bigint): bigint {
    return x < 0n ? -x : x;
  }

  /**
   * Calculates the greatest common divisor of two integers. The result is
   * always positive.
   */
  static gcd(x: bigint, y: bigint): bigint {
    // Make sure they are positive BigInts
    x = BigIntMath.abs(x) - 0n;
    y = BigIntMath.abs(y) - 0n;

    // Euclidean algorithm
    if (x < y) {
      const tmp = y;
      y = x;
      x = tmp;
    }
    while (y !== 0n) {
      const tmp = y;
      y = x % y;
      x = tmp;
    }
    return x;
  }
}
