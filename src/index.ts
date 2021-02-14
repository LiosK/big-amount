export class BigAmount {
  /**
   * Creates a [[BigAmount]] without validating arguments. It is highly
   * recommended to use [[BigAmount.create]] instead.
   *
   * @param num - Numerator.
   * @param den - Denominator.
   */
  constructor(public num: bigint, public den: bigint) {}

  /**
   * Creates a [[BigAmount]].
   *
   * @param x - Single value that is convertible to a [[BigAmount]], or a
   *            numerator if given together with `y`.
   * @param y - Optional denominator.
   */
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
      throw new TypeError(`unsupported type: ${typeof x}`);
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
   * Creates a [[BigAmount]] from `Number`. Unlike [[BigAmount.create]], this
   * method finds a rational approximate of non-integer finite number.
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
        if (coef < mid) {
          unum = num;
          uden = den;
        } else if (coef > mid) {
          lnum = num;
          lden = den;
        } else {
          break;
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
   *
   * @returns `this`.
   */
  private verify(): this {
    this.num - 0n;
    this.den - 0n;
    if (this.den === 0n) {
      throw new RangeError("denominator is zero");
    }
    return this;
  }

  /**
   * Converts `this` to the simplest form with a positive denominator.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
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

  /**
   * Changes the denominator of `this` and, accordingly, the numerator. This
   * method rounds the numerator in the specified rounding mode if it is not
   * divisible by the new denominator.
   *
   * @remarks
   * Note that the [[RoundingMode]] applies to the resulting numerator; the
   * outcome of "toward positive / negative" is determined by the sign of
   * numerator, which may be counterintuitive when the new denominator is
   * negative.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  changeDenominator(
    newDen: bigint,
    roundingMode: RoundingMode = "HALF_EVEN"
  ): this {
    if (this.den === newDen) {
      return this.verify();
    }
    if (this.den < 0n) {
      this.num = -this.num;
      this.den = -this.den;
    }

    const oldDen = this.den;
    const tmp = this.num * newDen;
    this.num = tmp / oldDen;
    this.den = newDen;
    const unit = tmp < 0n ? -1n : 1n;
    const rem = (tmp < 0n ? -tmp : tmp) % oldDen;

    if (rem === 0n) {
      // exact case
      return this.verify();
    }

    switch (roundingMode) {
      case "HALF_EVEN":
        if (
          rem * 2n > oldDen ||
          (rem * 2n === oldDen && (this.num & 1n) === 1n)
        ) {
          this.num += unit;
        }
        return this.verify();
      case "HALF_UP":
        if (rem * 2n >= oldDen) {
          this.num += unit;
        }
        return this.verify();
      case "UP":
        this.num += unit;
        return this.verify();
      case "DOWN":
        return this.verify();
      case "CEIL":
        if (unit > 0n) {
          this.num += unit;
        }
        return this.verify();
      case "FLOOR":
        if (unit < 0n) {
          this.num += unit;
        }
        return this.verify();
      default:
        throw new RangeError(
          `unknown rounding mode ${roundingMode}; choose one of ` +
            `"UP" | "DOWN" | "CEIL" | "FLOOR" | "HALF_UP" | "HALF_EVEN"`
        );
    }
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

  /**
   * Negates `this`.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  neg(): this {
    this.num = -this.num;
    return this;
  }

  /**
   * Converts `this` into the unsigned absolute value.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  abs(): this {
    this.num = BigIntMath.abs(this.num);
    this.den = BigIntMath.abs(this.den);
    return this;
  }

  /**
   * Converts `this` into the reciprocal (i.e. inverses the numerator and
   * denominator).
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  inv(): this {
    const tmp = this.num;
    this.num = this.den;
    this.den = tmp;
    return this.verify();
  }

  /**
   * Adds `other` to `this`.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  add(other: BigAmount): this {
    if (this.den === other.den) {
      this.num += other.num;
    } else {
      this.num = this.num * other.den + other.num * this.den;
      this.den *= other.den;
    }
    return this.verify();
  }

  /**
   * Subtracts `other` from `this`.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  sub(other: BigAmount): this {
    if (this.den === other.den) {
      this.num -= other.num;
    } else {
      this.num = this.num * other.den - other.num * this.den;
      this.den *= other.den;
    }
    return this.verify();
  }

  /**
   * Multiplies `this` by `other`.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  mul(other: BigAmount): this {
    this.num *= other.num;
    this.den *= other.den;
    return this.verify();
  }

  /**
   * Divides `this` by `other`.
   *
   * @returns Mutated `this`; this method operates in-place.
   */
  div(other: BigAmount): this {
    this.num *= other.den;
    this.den *= other.num;
    return this.verify();
  }
}

/** Shortcut for [[BigAmount.create]] */
export const Q = BigAmount.create;

/**
 * Represents rounding modes.
 *
 * @remarks
 * | Value          | Mode                                  |
 * |----------------|---------------------------------------|
 * | `"UP"`         | Toward inifinity (away from zero)     |
 * | `"DOWN"`       | Toward zero                           |
 * | `"CEIL"`       | Toward positive                       |
 * | `"FLOOR"`      | Toward negative                       |
 * | `"HALF_UP"`    | Ties toward infinity (away from zero) |
 * | `"HALF_EVEN"`  | Ties to even                          |
 */
export type RoundingMode =
  | "UP"
  | "DOWN"
  | "CEIL"
  | "FLOOR"
  | "HALF_UP"
  | "HALF_EVEN";

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
