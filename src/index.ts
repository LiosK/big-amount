/**
 * big-amount: BigInt-based rational number library focused on accounting
 *
 * @license Apache-2.0
 * @copyright 2021 LiosK
 */

/**
 * BigAmount class
 *
 * @example
 * ```javascript
 * import { q, BigAmount } from "big-amount";
 *
 * let x = q("1/2") // Equivalent to BigAmount.create("1/2")
 *   .neg()
 *   .abs()
 *   .inv()
 *   .add(q("34.5"))
 *   .sub(q(".67"))
 *   .mul(q(-8n, 9n))
 *   .div(q(10))
 *   .reduce(); // Reduction to the simplest form
 *
 * console.log(x.toString()); // "-3583/1125"
 * console.log(x.toFixed(6)); // "-3.184889"
 * ```
 */
export class BigAmount {
  /**
   * Creates a [[BigAmount]] without validating arguments. It is highly
   * recommended to use [[BigAmount.create]] instead.
   *
   * @param num - Numerator.
   * @param den - Denominator.
   */
  constructor(private num: bigint, private den: bigint) {}

  /**
   * Creates a [[BigAmount]] from various arguments. For convenience, this
   * method is also exported as [[q]] and is callable as `q(x)` and `q(x, y)`.
   *
   * @example `BigAmount.create(x)` creates an instance representing _x/1_.
   * ```javascript
   * q(123n);        // 123/1
   * q(123);         // 123/1
   * q("123");       // 123/1
   * q("123.45");    // 12345/100
   * q("123.45e-6"); // 12345/100000000
   *
   * q("123/45");    // 123/45
   * q("12.3/-4.5"); // 1230/-450
   * ```
   *
   * Note that non-integer `number` values have to be passed as `string`.
   *
   * ```javascript
   * q(123.45);   // ERROR!
   * q(123 / 45); // ERROR!
   * ```
   *
   * @example `BigAmount.create(x, y)` creates an instance representing _x/y_.
   * ```javascript
   * q(123n, 45n);    // 123/45
   * q(123, 45);      // 123/45
   *
   * q(123, 45n);     // 123/45
   * q(123n, "4.5");  // 1230/45
   *
   * q("1/2", "3/4"); // 4/6
   * q("1/2", "3.4"); // 10/68
   * ```
   *
   * @remarks
   * This method accepts the following arguments:
   *
   * -  [[BigAmount]] - Any [[BigAmount]] value.
   * -  `bigint` - Any `bigint` value.
   * -  `number` - _Integer only._ This is because it is often imprecise and
   *    computationally expensive to find a rational approximate of a
   *    floating-point number. Pass the number as a string (e.g. `"1/3"`,
   *    `"1.23"`) to create an exact value or use [[BigAmount.fromNumber]] to
   *    find an approximate.
   * -  `string` - Rational (e.g. `"1/23"`), integer (e.g. `"123"`, `"0xFF"`),
   *    decimal fraction (e.g. `"-1.23"`, `".123"`), scientific (e.g.
   *    `"1.23e-4"`, `"-123e+4"`). The rational notation `q("num/den")` is
   *    equivalent to `q("num", "den")`.
   *
   * @category Instance Creation
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
    const patIntLike = /^\s*(?:[-+]?[0-9]+|0x[0-9a-f]+|0o[0-7]+|0b[01]+)\s*$/i;
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
        const match = x.match(
          /^\s*([-+]?)(?:([0-9]*)\.([0-9]+)|([0-9]+))(?:e([-+]?[0-9]+))?\s*$/i
        );
        if (match !== null) {
          const [
            ,
            sign,
            dsInt = "",
            dsFrac = "",
            dsIntOnly = "",
            dsExp = "0",
          ] = match;
          const num = BigInt(`${sign}${dsInt}${dsFrac}${dsIntOnly}` || "0");
          const exp = BigInt(dsExp) - BigInt(dsFrac.length);
          return exp > 0
            ? new BigAmount(num * 10n ** exp, 1n)
            : new BigAmount(num, 10n ** -exp);
        }
        throw new SyntaxError(`Cannot convert ${x} to a BigAmount`);
      }
      throw new TypeError(`unsupported type: ${typeof x}`);
    } else {
      // `create(x, y)`
      if (typeof x === "bigint" && typeof y === "bigint") {
        // Fast track for `create(x: int-like, y: int-like)`
        return new BigAmount(x, y).verify();
      }
      return BigAmount.create(x).idiv(BigAmount.create(y));
    }
  }

  /**
   * Creates a [[BigAmount]] from `Number`. Unlike [[BigAmount.create]], this
   * method finds a rational approximate of non-integer finite number.
   *
   * @category Instance Creation
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

  /**
   * Creates a [[BigAmount]] as the sum of values in a list.
   *
   * @example
   * ```javascript
   * BigAmount.sum(["123/100", "-456/100", "789/100"]); // 456/100
   * ```
   *
   * @param xs - Array of values that are acceptable by [[BigAmount.create]].
   * @category Instance Creation
   */
  static sum(xs: Array<BigAmount | bigint | number | string>): BigAmount {
    const acc = BigAmount.create(xs[0] ?? 0n);
    for (let i = 1, len = xs.length; i < len; i++) {
      acc.iadd(BigAmount.create(xs[i]));
    }
    return acc;
  }

  /**
   * Returns a copy of `this`.
   *
   * @category Instance Creation
   */
  clone(): BigAmount {
    return new BigAmount(this.num, this.den);
  }

  /**
   * Returns the sign of `this`.
   *
   * @returns `1n` if positive, `-1n` if negative, `0n` if zero.
   * @category Basic
   */
  sign(): bigint {
    this.verify();
    if (this.num === 0n) {
      return 0n;
    } else if (this.num < 0n) {
      return this.den < 0n ? 1n : -1n;
    } else {
      return this.den < 0n ? -1n : 1n;
    }
  }

  /**
   * Returns the numerator of `this`.
   *
   * @category Basic
   */
  numerator(): bigint {
    return this.num;
  }

  /**
   * Returns the denominator of `this`.
   *
   * @category Basic
   */
  denominator(): bigint {
    return this.den;
  }

  /**
   * Asserts that `this` is composed of `BigInt` values and the denominator is
   * non-zero.
   *
   * @returns `this`.
   * @category Basic
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
   * Compares two [[BigAmount]]s. This method coordinates with `Array#sort`.
   *
   * @returns `-1` if `x` is less than `y`, `0` if `x` equals to `y`, or `1` if
   *          `x` is greater than `y`.
   * @category Comparison
   */
  static cmp(x: BigAmount, y: BigAmount): number {
    x.verify();
    y.verify();
    const diff = x.num * y.den - x.den * y.num;
    return diff === 0n
      ? 0
      : (diff < 0n ? -1 : 1) * (x.den < 0n ? -1 : 1) * (y.den < 0n ? -1 : 1);
  }

  /**
   * Returns true if `this` is an equivalent fraction to `other`.
   *
   * @category Comparison
   */
  eq(other: BigAmount): boolean {
    return BigAmount.cmp(this, other) === 0;
  }

  /**
   * Converts `this` to the simplest form with a positive denominator.
   *
   * @remarks
   * This method has to be called explicitly to obtain the canonical form of a
   * fraction because most of the methods in this class do not reduce the result
   * automatically.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  ireduce(): this {
    this.verify();
    if (this.num === 0n) {
      this.den = 1n;
    } else {
      const gcd = findGcd(this.num, this.den);
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
   * Equivalent to `x.clone().ireduce()`.
   *
   * @category Arithmetic Operation
   */
  reduce(): BigAmount {
    return this.clone().ireduce();
  }

  /**
   * Changes the denominator of `this` and, accordingly, the numerator. This
   * method rounds the numerator in the specified rounding mode if it is not
   * divisible by the new denominator.
   *
   * @remarks
   * Note that the [[RoundingMode]] applies to the resulting numerator; the
   * outcome of "toward positive / negative" is determined by the sign of
   * numerator, which could be counterintuitive when the new denominator is
   * negative.
   *
   * @example Rounding a repeating decimal to a fixed-digit decimal
   * ```javascript
   * let x = BigAmount.create("1/3"); // 1/3 = 0.333333...
   * x.ichangeDenominator(100n);      // 33/100 = 0.33
   * ```
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  ichangeDenominator(
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
        // XXX not invoked if this.den === newDen or rem === 0n
        throw new RangeError(
          `unknown rounding mode ${roundingMode}; choose one of ` +
            `"UP" | "DOWN" | "CEIL" | "FLOOR" | "HALF_UP" | "HALF_EVEN"`
        );
    }
  }

  /**
   * Equivalent to `x.clone().ichangeDenominator(newDen, roundingMode)`.
   *
   * @category Arithmetic Operation
   */
  changeDenominator(
    newDen: bigint,
    roundingMode: RoundingMode = "HALF_EVEN"
  ): BigAmount {
    return this.clone().ichangeDenominator(newDen, roundingMode);
  }

  /**
   * Negates `this`.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  ineg(): this {
    this.num = -this.num;
    return this;
  }

  /**
   * Converts `this` into the unsigned absolute value.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  iabs(): this {
    this.num = this.num < 0n ? -this.num : this.num;
    this.den = this.den < 0n ? -this.den : this.den;
    return this;
  }

  /**
   * Converts `this` into the reciprocal (i.e. inverses the numerator and
   * denominator).
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  iinv(): this {
    const tmp = this.num;
    this.num = this.den;
    this.den = tmp;
    return this.verify();
  }

  /**
   * Adds `other` to `this`.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  iadd(other: BigAmount): this {
    if (this.den === other.den) {
      this.num += other.num;
    } else {
      const tmp = other.num * this.den;
      if (tmp % other.den === 0n) {
        this.num += tmp / other.den;
      } else {
        this.num = this.num * other.den + tmp;
        this.den *= other.den;
      }
    }
    return this.verify();
  }

  /**
   * Subtracts `other` from `this`.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  isub(other: BigAmount): this {
    if (this.den === other.den) {
      this.num -= other.num;
    } else {
      const tmp = other.num * this.den;
      if (tmp % other.den === 0n) {
        this.num -= tmp / other.den;
      } else {
        this.num = this.num * other.den - tmp;
        this.den *= other.den;
      }
    }
    return this.verify();
  }

  /**
   * Multiplies `this` by `other`.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  imul(other: BigAmount): this {
    this.num *= other.num;
    if (this.num % other.den === 0n) {
      this.num /= other.den;
    } else {
      this.den *= other.den;
    }
    return this.verify();
  }

  /**
   * Divides `this` by `other`.
   *
   * @returns Mutated `this`; this method operates _in place_.
   * @category Arithmetic Operation
   */
  idiv(other: BigAmount): this {
    this.num *= other.den;
    if (this.num % other.num === 0n) {
      this.num /= other.num;
    } else {
      this.den *= other.num;
    }
    return this.verify();
  }

  /**
   * Equivalent to `x.clone().ineg()`.
   *
   * @category Arithmetic Operation
   */
  neg(): BigAmount {
    return this.clone().ineg();
  }

  /**
   * Equivalent to `x.clone().iabs()`.
   *
   * @category Arithmetic Operation
   */
  abs(): BigAmount {
    return this.clone().iabs();
  }

  /**
   * Equivalent to `x.clone().iinv()`.
   *
   * @category Arithmetic Operation
   */
  inv(): BigAmount {
    return this.clone().iinv();
  }

  /**
   * Equivalent to `x.clone().iadd(other)`.
   *
   * @category Arithmetic Operation
   */
  add(other: BigAmount): BigAmount {
    return this.clone().iadd(other);
  }

  /**
   * Equivalent to `x.clone().isub(other)`.
   *
   * @category Arithmetic Operation
   */
  sub(other: BigAmount): BigAmount {
    return this.clone().isub(other);
  }

  /**
   * Equivalent to `x.clone().imul(other)`.
   *
   * @category Arithmetic Operation
   */
  mul(other: BigAmount): BigAmount {
    return this.clone().imul(other);
  }

  /**
   * Equivalent to `x.clone().idiv(other)`.
   *
   * @category Arithmetic Operation
   */
  div(other: BigAmount): BigAmount {
    return this.clone().idiv(other);
  }

  /** @category Conversion */
  toString(): string {
    return `${this.num}/${this.den}`;
  }

  /** @category Conversion */
  toJSON(): string {
    return `${this.num}/${this.den}`;
  }

  /**
   * Formats a [[BigAmount]] using decimal fixed-point notation just like
   * `Number#toFixed`. This method additionally takes rounding and formatting
   * options to customize the output.
   *
   * @example
   * ```javascript
   * let x = BigAmount.create("12345678.9");
   * x.toFixed(2);                            // "12345678.90"
   * x.toFixed(2, { decimalSeparator: "," }); // "12345678,90"
   * x.toFixed(2, { groupSeparator: "," });   // "12,345,678.90"
   * ```
   *
   * @param digits - Number of digits to appear after the decimal separator.
   * @param decimalSeparator - [Default: `"."`] Character used to separate the
   *        integer part from the fractional part.
   * @param groupSeparator - [Default: `""`] Delimiter used to separate the
   *        groups of thousands (three digits) of the integer part. Grouping is
   *        disabled by default; give `","`, `"."`, `" "`, or any other
   *        delimiter to enable grouping. This method does not support other
   *        grouping rules than the groups of three digits.
   * @param roundingMode - [Default: `"HALF_EVEN"`] Rounding mode applied when
   *        necessary. See [[RoundingMode]] for possible values.
   * @category Conversion
   */
  toFixed(
    digits = 0,
    {
      decimalSeparator = ".",
      groupSeparator = "",
      roundingMode = "HALF_EVEN",
    }: {
      decimalSeparator?: string;
      groupSeparator?: string;
      roundingMode?: RoundingMode;
    } = {}
  ): string {
    const term = 10n ** BigInt(digits);
    let sign = "";
    let num = this.clone().ichangeDenominator(term, roundingMode).num;
    if (num < 0n) {
      sign = "-";
      num = -num;
    }

    let intPart = (num / term).toString();
    if (groupSeparator !== "") {
      const groups = [intPart.slice(-3)];
      for (let i = -3, len = -intPart.length; i > len; i -= 3) {
        groups.unshift(intPart.slice(-3 + i, i));
      }
      intPart = groups.join(groupSeparator);
    }
    if (digits > 0) {
      const fracPart = (num % term).toString().padStart(digits, "0");
      return `${sign}${intPart}${decimalSeparator}${fracPart}`;
    } else {
      return `${sign}${intPart}`;
    }
  }
}

/** Shortcut for [[BigAmount.create]] */
export const q = BigAmount.create;

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

/**
 * Calculates the greatest common divisor of two integers. The result is always
 * positive.
 */
const findGcd = (x: bigint, y: bigint): bigint => {
  // Make sure they are positive BigInts
  x = (x < 0n ? -x : x) - 0n;
  y = (y < 0n ? -y : y) - 0n;

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
};
