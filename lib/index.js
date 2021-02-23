/**
 * big-amount: BigInt-based rational number library focused on accounting
 *
 * @license Apache-2.0
 * @copyright 2021 LiosK
 */
/**
 * @example
 * ```javascript
 * import { q, BigAmount } from "big-amount";
 *
 * let x = q("1/2")           // Same as `BigAmount.create("1/2")`
 *   .neg()                   // Unary `-`
 *   .inv()                   // Inverse (`1 / x`)
 *   .add(q("34.5"))          // `+`
 *   .sub(q(".67"))           // `-`
 *   .mul(q(-8n, 9n))         // `*`
 *   .div(q(10))              // `/`
 *   .abs()                   // To absolute value
 *   .reduce();               // To irreducible form
 *
 * console.log(x.toString()); // "1061/375"
 * console.log(x.toFixed(6)); // "2.829333"
 * ```
 */
export class BigAmount {
    /** Creates a [[BigAmount]] from a pair of integers. */
    constructor(numerator, denominator) {
        this.num = numerator;
        this.den = denominator;
        if (typeof numerator !== "bigint") {
            throw new TypeError("numerator is not a bigint");
        }
        if (typeof denominator !== "bigint") {
            throw new TypeError("denominator is not a bigint");
        }
        if (denominator === 0n) {
            throw new RangeError("denominator is zero");
        }
    }
    /**
     * Creates a [[BigAmount]] from various arguments. For convenience, this
     * method is also exported as [[q]] and is callable as `q(x)` and `q(x, y)`.
     *
     * @example `BigAmount.create(x)` creates an instance representing _x / 1_.
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
     * Note that non-integral `number` values have to be passed as `string`.
     *
     * ```javascript
     * q(123.45);   // ERROR!
     * q(123 / 45); // ERROR!
     * ```
     *
     * @example `BigAmount.create(x, y)` creates an instance representing _x / y_.
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
     *    expensive to find a rational approximate of a non-integral number.
     *    Pass the number as a string (e.g. `"1/3"`, `"1.23"`) to create an exact
     *    value or use [[BigAmount.fromNumber]] to find an approximate.
     * -  `string` - Fraction (`"1/23"`), integer (`"123"`, `"0xFF"`), decimal
     *    (`"-1.23"`, `".123"`), or scientific (`"1.23e-4"`, `"-12e+3"`). The
     *    fractional notation `q("num/den")` is equivalent to `q("num", "den")`.
     *
     * @category Instance Creation
     */
    static create(x, y) {
        // `create("x/y")` is equivalent to `create("x", "y")`
        if (typeof x === "string" && y == null) {
            const pair = x.split("/");
            if (pair.length === 2) {
                [x, y] = pair;
            }
        }
        // Convert int-like to BigInt
        const patIntLike = /^\s*(?:[-+]?[0-9]+|0x[0-9a-f]+|0o[0-7]+|0b[01]+)\s*$/i;
        if ((typeof x === "number" && Number.isInteger(x)) ||
            (typeof x === "string" && patIntLike.test(x))) {
            x = BigInt(x);
        }
        if ((typeof y === "number" && Number.isInteger(y)) ||
            (typeof y === "string" && patIntLike.test(y))) {
            y = BigInt(y);
        }
        if (y == null) {
            // `create(x)`
            if (x instanceof BigAmount) {
                return x.clone();
            }
            else if (typeof x === "bigint") {
                return new BigAmount(x, 1n);
            }
            else if (typeof x === "number") {
                throw new RangeError(Number.isFinite(x)
                    ? `non-integral Number value: ${x}` +
                        "; pass it as a string or use `fromNumber()` instead"
                    : `unsupported Number value: ${x}`);
            }
            else if (typeof x === "string") {
                const match = x.match(/^\s*([-+]?)(?:([0-9]*)\.([0-9]+)|([0-9]+))(?:e([-+]?[0-9]+))?\s*$/i);
                if (match !== null) {
                    const [, sign, dsInt = "", dsFrac = "", dsIntOnly = "", dsExp = "0",] = match;
                    const num = BigInt(`${sign}${dsInt}${dsFrac}${dsIntOnly}` || "0");
                    const exp = BigInt(dsExp) - BigInt(dsFrac.length);
                    return exp > 0
                        ? new BigAmount(num * 10n ** exp, 1n)
                        : new BigAmount(num, 10n ** -exp);
                }
                throw new SyntaxError(`Cannot convert ${x} to a BigAmount`);
            }
            throw new TypeError(`unsupported type: ${typeof x}`);
        }
        else {
            // `create(x, y)`
            if (typeof x === "bigint" && typeof y === "bigint") {
                // Fast track for `create(x: int-like, y: int-like)`
                return new BigAmount(x, y);
            }
            return BigAmount.create(x).div(BigAmount.create(y));
        }
    }
    /**
     * Creates a [[BigAmount]] from `number`. Unlike [[BigAmount.create]], this
     * method finds a rational approximate of a non-integral number.
     *
     * @category Instance Creation
     */
    static fromNumber(x, precision = 100000000) {
        if (Number.isInteger(x)) {
            return new BigAmount(BigInt(x), 1n);
        }
        else if (!Number.isFinite(x)) {
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
                }
                else if (coef > mid) {
                    lnum = num;
                    lden = den;
                }
                else {
                    break;
                }
            }
            if (coef < mid && coef - lnum / lden < mid - coef) {
                // lower --- coef ------------ mid
                [num, den] = [lnum, lden];
            }
            else if (coef > mid && unum / uden - coef < coef - mid) {
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
     * Creates a [[BigAmount]] instance of the sum of list items.
     *
     * @example
     * ```javascript
     * BigAmount.sum(["123/100", "-456/100", "789/100"]); // 456/100
     * ```
     *
     * @param xs - Array of values that are acceptable by [[BigAmount.create]].
     * @category Instance Creation
     */
    static sum(xs) {
        const groups = {};
        for (const x of xs) {
            const f = BigAmount.create(x);
            const den = String(f.den);
            groups[den] = den in groups ? groups[den].add(f) : f;
        }
        return xs.length === 0
            ? new BigAmount(0n, 1n)
            : Object.values(groups).reduce((acc, f) => acc.add(f));
    }
    /**
     * Returns a copy of `this`.
     *
     * @category Instance Creation
     */
    clone() {
        return new BigAmount(this.num, this.den);
    }
    /**
     * Returns the sign of `this`.
     *
     * @returns `1n` if positive, `-1n` if negative, `0n` if zero.
     */
    sign() {
        if (this.num === 0n) {
            return 0n;
        }
        else if (this.num < 0n) {
            return this.den < 0n ? 1n : -1n;
        }
        else {
            return this.den < 0n ? -1n : 1n;
        }
    }
    /**
     * Compares two [[BigAmount]]s. This method coordinates with `Array#sort`.
     *
     * @returns `-1` if `x` is less than `y`, `0` if `x` equals to `y`, or `1` if
     *          `x` is greater than `y`.
     * @category Comparison
     */
    static cmp(x, y) {
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
    eq(other) {
        return BigAmount.cmp(this, other) === 0;
    }
    /**
     * Returns the irreducible form of `this` with a positive denominator.
     *
     * @remarks
     * This method has to be called explicitly to obtain the canonical form of a
     * fraction because the methods in this class by design do not return the
     * irreducible form of the result.
     *
     * @category Arithmetic Operation
     */
    reduce() {
        if (this.num === 0n) {
            return new BigAmount(0n, 1n);
        }
        else {
            const gcd = findGcd(this.num, this.den);
            const num = this.num / gcd;
            const den = this.den / gcd;
            return den < 0n ? new BigAmount(-num, -den) : new BigAmount(num, den);
        }
    }
    /**
     * Performs the unary `-` operation.
     *
     * @category Arithmetic Operation
     */
    neg() {
        return new BigAmount(-this.num, this.den);
    }
    /**
     * Returns the unsigned absolute value of `this`.
     *
     * @category Arithmetic Operation
     */
    abs() {
        return new BigAmount(this.num < 0n ? -this.num : this.num, this.den < 0n ? -this.den : this.den);
    }
    /**
     * Returns the reciprocal of `this`.
     *
     * @category Arithmetic Operation
     */
    inv() {
        return new BigAmount(this.den, this.num);
    }
    /**
     * Adds `other` to `this`.
     *
     * @category Arithmetic Operation
     */
    add(other) {
        return this.den === other.den
            ? new BigAmount(this.num + other.num, this.den)
            : new BigAmount(this.num * other.den + this.den * other.num, this.den * other.den);
    }
    /**
     * Subtracts `other` from `this`.
     *
     * @category Arithmetic Operation
     */
    sub(other) {
        return this.den === other.den
            ? new BigAmount(this.num - other.num, this.den)
            : new BigAmount(this.num * other.den - this.den * other.num, this.den * other.den);
    }
    /**
     * Multiplies `this` by `other`.
     *
     * @category Arithmetic Operation
     */
    mul(other) {
        return new BigAmount(this.num * other.num, this.den * other.den);
    }
    /**
     * Divides `this` by `other`.
     *
     * @category Arithmetic Operation
     */
    div(other) {
        return new BigAmount(this.num * other.den, this.den * other.num);
    }
    /**
     * Returns a fractional approximate of `this` that has the specified
     * denominator. This method rounds the numerator using the specified rounding
     * mode if it is not divisible by the new denominator.
     *
     * @example Rounding a repeating decimal to a fixed-digit decimal
     * ```javascript
     * let x = BigAmount.create("1/3"); // 1/3 = 0.333333...
     * x.quantize(100n);                // 33/100 = 0.33
     * ```
     *
     * @remarks
     * Note that the [[RoundingMode]] applies to the resulting numerator; the
     * outcome of "toward positive / negative" is determined by the sign of
     * numerator, which could be counterintuitive when the new denominator is
     * negative.
     *
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    quantize(newDen, roundingMode = "HALF_EVEN") {
        return this.den === newDen
            ? this.clone()
            : new BigAmount(new BigAmount(this.num * newDen, this.den).roundToInt(roundingMode), newDen);
    }
    /**
     * Returns a fractional approximate of `this` that is rounded to the multiple
     * of `1 / (10 ** ndigits)`, just like Python's built-in `round()`. This
     * method rounds ties to even by default.
     *
     * @param ndigits - Number of digits after the decimal separator.
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    round(ndigits = 0, roundingMode = "HALF_EVEN") {
        if (!Number.isInteger(ndigits)) {
            throw new RangeError("ndigits is not an integer");
        }
        const term = 10n ** BigInt(Math.abs(ndigits));
        if (ndigits < 0) {
            const div = new BigAmount(this.num, this.den * term);
            return new BigAmount(div.roundToInt(roundingMode) * term, 1n);
        }
        else {
            return this.quantize(term, roundingMode);
        }
    }
    /**
     * Returns an integral approximate of `this`, rounding ties to even by
     * default.
     *
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    roundToInt(roundingMode = "HALF_EVEN") {
        const num = this.den < 0n ? -this.num : this.num;
        const den = this.den < 0n ? -this.den : this.den;
        let quot = num / den;
        const rem = (num < 0n ? -num : num) % den;
        const unit = num < 0n ? -1n : 1n;
        if (rem === 0n) {
            return quot;
        }
        switch (roundingMode) {
            case "HALF_EVEN":
                if (rem * 2n > den || (rem * 2n === den && (quot & 1n) === 1n)) {
                    quot += unit;
                }
                return quot;
            case "HALF_UP":
                if (rem * 2n >= den) {
                    quot += unit;
                }
                return quot;
            case "UP":
                quot += unit;
                return quot;
            case "DOWN":
                return quot;
            case "CEIL":
                if (unit > 0n) {
                    quot += unit;
                }
                return quot;
            case "FLOOR":
                if (unit < 0n) {
                    quot += unit;
                }
                return quot;
            default:
                // XXX not invoked if rem === 0n
                throw new RangeError(`unknown rounding mode ${roundingMode}; choose one of ` +
                    `"UP" | "DOWN" | "CEIL" | "FLOOR" | "HALF_UP" | "HALF_EVEN"`);
        }
    }
    /** @category Conversion */
    toString() {
        return `${this.num}/${this.den}`;
    }
    /** @category Conversion */
    toJSON() {
        return `${this.num}/${this.den}`;
    }
    /**
     * Formats a [[BigAmount]] using decimal fixed-point notation just like
     * `Number#toFixed`. This method additionally takes rounding and formatting
     * options to customize the output.
     *
     * @example
     * ```javascript
     * let x = BigAmount.create("123456789/10");
     * x.toFixed(2);                            // "12345678.90"
     * x.toFixed(2, { decimalSeparator: "," }); // "12345678,90"
     * x.toFixed(2, { groupSeparator: "," });   // "12,345,678.90"
     * ```
     *
     * @param ndigits - Number of digits to appear after the decimal separator.
     * @param decimalSeparator - [Default: `"."`] Character used to separate the
     *        integer part from the fractional part.
     * @param groupSeparator - [Default: `""`] Delimiter used to separate the
     *        groups of thousands (three digits) of the integer part. Grouping is
     *        disabled by default; give `","`, `"."`, `" "`, or any other
     *        delimiter to enable grouping. This method does not support other
     *        grouping rules than the groups of three digits.
     * @param roundingMode - [Default: `"HALF_EVEN"`] Rounding mode applied to the
     *        last digit. See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    toFixed(ndigits = 0, { decimalSeparator = ".", groupSeparator = "", roundingMode = "HALF_EVEN", } = {}) {
        if (ndigits < 0) {
            throw new RangeError("ndigits is negative");
        }
        const buffer = [];
        const decimal = this.round(ndigits, roundingMode);
        const absNum = decimal.num < 0n ? -decimal.num : decimal.num;
        // integer part
        const intPart = String(absNum / decimal.den);
        if (groupSeparator === "") {
            buffer.push(intPart);
        }
        else {
            const groups = [intPart.slice(-3)];
            for (let i = -3, len = -intPart.length; i > len; i -= 3) {
                groups.unshift(intPart.slice(-3 + i, i));
            }
            buffer.push(groups.join(groupSeparator));
        }
        // fractional part
        if (ndigits > 0) {
            buffer.push(decimalSeparator, String(absNum % decimal.den).padStart(ndigits, "0"));
        }
        // sign
        if (decimal.num < 0n) {
            buffer.unshift("-");
        }
        return buffer.join("");
    }
}
/** Shortcut for [[BigAmount.create]] */
export const q = BigAmount.create;
/**
 * Calculates the greatest common divisor of two integers. The result is always
 * positive.
 */
const findGcd = (x, y) => {
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
