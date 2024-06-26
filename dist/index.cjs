"use strict";
/**
 * big-amount: BigInt-based rational number library focused on accounting
 *
 * @license Apache-2.0
 * @copyright 2021-2022 LiosK
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.q = exports.BigAmount = void 0;
/**
 * @example
 * ```javascript
 * import { q, BigAmount } from "big-amount";
 *
 * let f = q("1/2")           // Same as `BigAmount.create("1/2")`
 *   .neg()                   // Unary `-`
 *   .inv()                   // Inverse (`1 / f`)
 *   .add(q("34.5"))          // `+`
 *   .sub(q(".67"))           // `-`
 *   .mul(q(-8n, 9n))         // `*`
 *   .div(q(10))              // `/`
 *   .abs()                   // To absolute value
 *   .reduce();               // To irreducible form
 *
 * console.log(f.toJSON());   // "1061/375"
 * console.log(f.toFixed(6)); // "2.829333"
 *
 * let s = BigAmount.sum([
 *   "2200811.81",
 *   "5954398.62",
 *   "-6217732.25",
 *   "-9336803.50",
 * ]).toFixed(2, {
 *   groupSeparator: ",",
 *   templates: ["${}", "$({})"],
 * });
 * console.log(s); // "$(7,399,325.32)"
 * ```
 */
class BigAmount {
    /** Creates a {@link BigAmount} from a pair of integers. */
    constructor(numerator, denominator) {
        this.num = numerator;
        this.den = denominator;
        if (typeof numerator !== "bigint" || typeof denominator !== "bigint") {
            throw new TypeError("numerator or denominator is not a bigint");
        }
        if (denominator === 0n) {
            throw new RangeError("denominator is zero");
        }
    }
    /**
     * Creates a {@link BigAmount} from various arguments. For convenience, this
     * method is also exported as {@link q} and is callable as `q(x)` and
     * `q(x, y)`.
     *
     * @example BigAmount.create(x) creates an instance representing x/1.
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
     * @example BigAmount.create(x, y) creates an instance representing x/y.
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
     * This method accepts the following BigAmount-like arguments:
     *
     * -  `bigint` - Any `bigint` value.
     * -  `number` - _Integer only._ This is because it is often imprecise and
     *    expensive to find a rational approximate of a non-integral number. Pass
     *    the number as a string (e.g. `"1/3"`, `"1.23"`) to create an exact value
     *    or use {@link BigAmount.fromNumber} to find an approximate.
     * -  `string` - Fraction (`"1/23"`), integer (`"123"`, `"0xFF"`), decimal
     *    (`"-1.23"`, `".123"`), or scientific (`"1.23e-4"`, `"-12e+3"`). The
     *    fractional notation `q("num/den")` is equivalent to `q("num", "den")`.
     * -  `object` - Any object (including any {@link BigAmount} value) that has
     *    two BigAmount-like scalar fields named `num` and `den`. `q({ num: x, den:
     *    y })` is equivalent to `q(x, y)`, except that the fields do not accept
     *    an object.
     *
     * @param x - `bigint` | `number` | `string` | `{ num: bigint | number |
     *        string; den: bigint | number | string }`
     * @param y - `bigint` | `number` | `string` | `{ num: bigint | number |
     *        string; den: bigint | number | string }`
     * @category Instance Creation
     */
    static create(x, y) {
        // Treat `create("x/y")` and `create({ num: x, den: y })` as `create(x, y)`
        if (y == null) {
            if (typeof x === "string") {
                const match = PATTERN_FRACTION.exec(x);
                if (match !== null) {
                    [, x, y] = match;
                }
            }
            else if (typeof x === "object") {
                ({ num: x, den: y } = x);
                if (typeof y === "object") {
                    // Unreachable in TypeScript
                    throw new TypeError("unsupported object value");
                }
            }
        }
        // Convert int-like to BigInt
        if ((typeof x === "number" && Number.isInteger(x)) ||
            (typeof x === "string" && PATTERN_INTEGER.test(x))) {
            x = BigInt(x);
        }
        if ((typeof y === "number" && Number.isInteger(y)) ||
            (typeof y === "string" && PATTERN_INTEGER.test(y))) {
            y = BigInt(y);
        }
        if (y == null) {
            // `create(x)`
            if (typeof x === "bigint") {
                return new BigAmount(x, 1n);
            }
            else if (typeof x === "number") {
                throw new RangeError(Number.isFinite(x)
                    ? `non-integral Number value: ${x}` +
                        "; pass it as a string or use `fromNumber()` instead"
                    : `unsupported Number value: ${x}`);
            }
            else if (typeof x === "string") {
                const match = PATTERN_DECIMAL.exec(x);
                if (match !== null) {
                    const [, sign, dsInt = "", dsFrac = "", dsIntOnly = "", dsExp = "0"] = match;
                    const num = BigInt(`${sign}${dsInt}${dsFrac}${dsIntOnly}` || "0");
                    const exp = BigInt(dsExp) - BigInt(dsFrac.length);
                    return exp > 0
                        ? new BigAmount(num * 10n ** exp, 1n)
                        : new BigAmount(num, 10n ** -exp);
                }
                throw new SyntaxError(`cannot convert ${x} to a BigAmount`);
            }
            // Unreachable in TypeScript
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
     * Creates a {@link BigAmount} from `number`. Unlike {@link BigAmount.create},
     * this method finds a rational approximate of a non-integral number.
     *
     * @category Instance Creation
     */
    static fromNumber(x) {
        const PRECISION = 100000000;
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
            // Approximate `coef` using Farey sequences
            let [lnum, lden] = [1, 1];
            let [unum, uden] = [2, 1];
            let mid = 1.5;
            while (lden + uden <= PRECISION) {
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
        const term = 2n ** BigInt(Math.abs(exp));
        return exp > 0
            ? new BigAmount(BigInt(Math.sign(x) * num) * term, BigInt(den))
            : new BigAmount(BigInt(Math.sign(x) * num), BigInt(den) * term);
    }
    /**
     * Creates a {@link BigAmount} instance of the sum of list items.
     *
     * @example
     * ```javascript
     * BigAmount.sum(["123/100", "-456/100", "789/100"]); // 456/100
     * ```
     *
     * @param xs - Array of values that {@link BigAmount.create} accepts.
     * @category Instance Creation
     */
    static sum(xs) {
        if (xs.length > 0) {
            const [head, ...tail] = xs.map((x) => BigAmount.create(x));
            return head.batchAdd(tail);
        }
        return new BigAmount(0n, 1n);
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
    /** Returns true if `this` is an integer. */
    isInteger() {
        return this.num % this.den === 0n;
    }
    /** Returns true if `this` is zero. */
    isZero() {
        return this.num === 0n;
    }
    /**
     * Returns `-1`, `0`, and `1` if `this` is less than, equal to, and greater
     * than `other`, respectively.
     *
     * @category Comparison
     */
    cmp(other) {
        const diff = this.num * other.den - this.den * other.num;
        return diff === 0n
            ? 0
            : (diff < 0n ? -1 : 1) *
                (this.den < 0n ? -1 : 1) *
                (other.den < 0n ? -1 : 1);
    }
    /**
     * Returns true if `this` is an equivalent fraction to `other`.
     *
     * @category Comparison
     */
    eq(other) {
        return this.cmp(other) === 0;
    }
    /**
     * Returns true if `this` is not an equivalent fraction to `other`.
     *
     * @category Comparison
     */
    ne(other) {
        return this.cmp(other) !== 0;
    }
    /**
     * Returns true if `this` is greater than `other`.
     *
     * @category Comparison
     */
    gt(other) {
        return this.cmp(other) > 0;
    }
    /**
     * Returns true if `this` is greater than or equal to `other`.
     *
     * @category Comparison
     */
    ge(other) {
        return this.cmp(other) >= 0;
    }
    /**
     * Returns true if `this` is less than `other`.
     *
     * @category Comparison
     */
    lt(other) {
        return this.cmp(other) < 0;
    }
    /**
     * Returns true if `this` is less than or equal to `other`.
     *
     * @category Comparison
     */
    le(other) {
        return this.cmp(other) <= 0;
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
        if (this.den === other.den) {
            return new BigAmount(this.num + other.num, this.den);
        }
        else if (this.den === -other.den) {
            return new BigAmount(this.num - other.num, this.den);
        }
        return new BigAmount(this.num * other.den + this.den * other.num, this.den * other.den);
    }
    /**
     * Subtracts `other` from `this`.
     *
     * @category Arithmetic Operation
     */
    sub(other) {
        if (this.den === other.den) {
            return new BigAmount(this.num - other.num, this.den);
        }
        else if (this.den === -other.den) {
            return new BigAmount(this.num + other.num, this.den);
        }
        return new BigAmount(this.num * other.den - this.den * other.num, this.den * other.den);
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
     * Adds `others` to `this`. This method is conceptually equivalent to
     * `f.add(others[0]).add(others[1])...`, except for optimization.
     *
     * @category Optimized Arithmetic Operation
     */
    batchAdd(others) {
        // take subtotals by denominator and then sum them up
        let numSameDen = this.num;
        const numsOtherDens = new Map();
        for (const x of others) {
            if (x.den === this.den) {
                numSameDen += x.num;
            }
            else {
                const num = x.den < 0n ? -x.num : x.num;
                const den = x.den < 0n ? -x.den : x.den;
                numsOtherDens.set(den, (numsOtherDens.get(den) || 0n) + num);
            }
        }
        let acc = new BigAmount(numSameDen, this.den);
        for (const [den, num] of numsOtherDens) {
            if (acc.den === den) {
                acc = new BigAmount(acc.num + num, acc.den);
            }
            else {
                // conceptually calling `q(num, den).tryQuantize(acc.den)` before
                // addition in order to alleviate inflation of the denominator
                const n = acc.den * num;
                acc =
                    n % den === 0n
                        ? new BigAmount(acc.num + n / den, acc.den)
                        : new BigAmount(acc.num * den + n, acc.den * den);
            }
        }
        return acc;
    }
    /**
     * Adds `other` to `this`, keeping the denominator unchanged. This method is
     * equivalent to `f.add(other).quantize(f.den, roundingMode)`.
     *
     * @category Optimized Arithmetic Operation
     */
    fixedAdd(other, roundingMode = "HALF_EVEN") {
        if (this.den === other.den) {
            return new BigAmount(this.num + other.num, this.den);
        }
        else if (this.den === -other.den) {
            return new BigAmount(this.num - other.num, this.den);
        }
        return new BigAmount(divInt(this.num * other.den + this.den * other.num, other.den, roundingMode), this.den);
    }
    /**
     * Subtracts `other` from `this`, keeping the denominator unchanged. This
     * method is equivalent to `f.sub(other).quantize(f.den, roundingMode)`.
     *
     * @category Optimized Arithmetic Operation
     */
    fixedSub(other, roundingMode = "HALF_EVEN") {
        if (this.den === other.den) {
            return new BigAmount(this.num - other.num, this.den);
        }
        else if (this.den === -other.den) {
            return new BigAmount(this.num + other.num, this.den);
        }
        return new BigAmount(divInt(this.num * other.den - this.den * other.num, other.den, roundingMode), this.den);
    }
    /**
     * Multiplies `this` by `other`, keeping the denominator unchanged. This
     * method is equivalent to `f.mul(other).quantize(f.den, roundingMode)`.
     *
     * @category Optimized Arithmetic Operation
     */
    fixedMul(other, roundingMode = "HALF_EVEN") {
        return new BigAmount(divInt(this.num * other.num, other.den, roundingMode), this.den);
    }
    /**
     * Divides `this` by `other`, keeping the denominator unchanged. This method
     * is equivalent to `f.div(other).quantize(f.den, roundingMode)`.
     *
     * @category Optimized Arithmetic Operation
     */
    fixedDiv(other, roundingMode = "HALF_EVEN") {
        if (other.num === 0n) {
            throw new RangeError("denominator is zero");
        }
        return new BigAmount(divInt(this.num * other.den, other.num, roundingMode), this.den);
    }
    /**
     * Multiplies `this` by `other`, resetting the denominator to `newDen`. This
     * method is equivalent to `f.mul(other).quantize(newDen, roundingMode)` and
     * is typically useful to multiply a quantity by unit price to calculate the
     * dollar amount at a specific precision.
     *
     * @category Optimized Arithmetic Operation
     */
    quantMul(other, newDen, roundingMode = "HALF_EVEN") {
        const den = this.den * other.den;
        return new BigAmount(den === newDen
            ? this.num * other.num
            : divInt(this.num * other.num * newDen, den, roundingMode), newDen);
    }
    /**
     * Divides `this` by `other`, resetting the denominator to `newDen`. This
     * method is equivalent to `f.div(other).quantize(newDen, roundingMode)` and
     * is typically useful to divide a dollar amount by quantity to calculate the
     * unit price at a specific precision.
     *
     * @category Optimized Arithmetic Operation
     */
    quantDiv(other, newDen, roundingMode = "HALF_EVEN") {
        if (other.num === 0n) {
            throw new RangeError("denominator is zero");
        }
        const den = this.den * other.num;
        return new BigAmount(den === newDen
            ? this.num * other.den
            : divInt(this.num * other.den * newDen, den, roundingMode), newDen);
    }
    /**
     * Returns a fractional approximate of `this` that has the specified
     * denominator. This method rounds the numerator using the specified rounding
     * mode if it is not divisible by the new denominator.
     *
     * @example Rounding a repeating decimal to a fixed-digit decimal
     * ```javascript
     * let f = BigAmount.create("1/3"); // 1/3 = 0.333333...
     * f.quantize(100n);                // 33/100 = 0.33
     * ```
     *
     * @remarks
     * Note that the {@link RoundingMode} applies to the resulting numerator; the
     * outcome of "toward positive / negative" is determined by the sign of
     * numerator, which could be counterintuitive when the new denominator is
     * negative.
     *
     * @param roundingMode - See {@link RoundingMode} for rounding mode options.
     * @category Conversion
     */
    quantize(newDen, roundingMode = "HALF_EVEN") {
        return new BigAmount(this.den === newDen
            ? this.num
            : divInt(this.num * newDen, this.den, roundingMode), newDen);
    }
    /**
     * Same as {@link BigAmount.quantize} but returns `undefined` if the numerator
     * needs to be rounded.
     *
     * @category Conversion
     */
    tryQuantize(newDen) {
        if (this.den === newDen) {
            return new BigAmount(this.num, this.den);
        }
        const n = this.num * newDen;
        return n % this.den === 0n ? new BigAmount(n / this.den, newDen) : void 0;
    }
    /**
     * Returns a fractional approximate of `this` that is rounded to the multiple
     * of `1 / (10 ** ndigits)`, just like Python's built-in `round()`. This
     * method rounds ties to even by default.
     *
     * @param ndigits - Number of digits after the decimal separator.
     * @param roundingMode - See {@link RoundingMode} for rounding mode options.
     * @category Conversion
     */
    round(ndigits = 0, roundingMode = "HALF_EVEN") {
        if (!Number.isInteger(ndigits)) {
            throw new RangeError("ndigits is not an integer");
        }
        const term = 10n ** BigInt(Math.abs(ndigits));
        if (ndigits < 0) {
            const num = divInt(this.num, this.den * term, roundingMode) * term;
            return new BigAmount(num, 1n);
        }
        else {
            return this.quantize(term, roundingMode);
        }
    }
    /**
     * Returns an integral approximate of `this`, rounding ties to even by
     * default.
     *
     * @param roundingMode - See {@link RoundingMode} for rounding mode options.
     * @category Conversion
     */
    roundToInt(roundingMode = "HALF_EVEN") {
        return divInt(this.num, this.den, roundingMode);
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
     * Returns `this` as a `number`.
     *
     * @category Conversion
     */
    toNumber() {
        const f = this.reduce();
        if (f.num === 0n) {
            return 0;
        }
        else if (f.num >= Number.MIN_SAFE_INTEGER &&
            f.num <= Number.MAX_SAFE_INTEGER &&
            f.den <= Number.MAX_SAFE_INTEGER) {
            return Number(f.num) / Number(f.den);
        }
        return Number(f.toExponential(20));
    }
    /**
     * Formats a {@link BigAmount} using decimal exponential notation just like
     * `Number#toExponential`. Unlike `Number#toExponential`, this method always
     * requires the first argument.
     *
     * @param ndigits - Number of digits to appear after the decimal separator.
     * @category Conversion
     */
    toExponential(ndigits) {
        let num = this.num < 0n ? -this.num : this.num;
        let den = this.den < 0n ? -this.den : this.den;
        let exp = String(num).length - String(den).length;
        if (exp < 0) {
            num *= 10n ** BigInt(-exp);
        }
        else if (exp > 0) {
            den *= 10n ** BigInt(exp);
        }
        if (num === 0n) {
            exp = 0;
        }
        else if (num < den) {
            num *= 10n;
            exp--;
        }
        let coef = new BigAmount(num, den).toFixed(ndigits);
        if (/^10/.test(coef)) {
            // happens when 999999... is rounded
            den *= 10n;
            exp++;
            coef = new BigAmount(num, den).toFixed(ndigits);
        }
        return `${this.sign() < 0n ? "-" : ""}${coef}e${exp < 0 ? "" : "+"}${exp}`;
    }
    /**
     * Formats a {@link BigAmount} using decimal fixed-point notation just like
     * `Number#toFixed`. In addition, this method takes format options to
     * customize the output. See {@link FormatOptions} for options and examples.
     *
     * @param ndigits - Number of digits to appear after the decimal separator.
     * @category Conversion
     */
    toFixed(ndigits = 0, formatOptions) {
        const { decimalSeparator = ".", groupSeparator = "", templates = ["{}"], experimentalUseLakhCrore = false, } = formatOptions || {};
        if (ndigits < 0) {
            throw new RangeError("ndigits is negative");
        }
        const buffer = [];
        const decimal = this.round(ndigits);
        const absNum = decimal.num < 0n ? -decimal.num : decimal.num;
        // integer part
        const intPart = String(absNum / decimal.den);
        if (groupSeparator === "") {
            buffer.push(intPart);
        }
        else {
            const groups = [intPart.slice(-3)];
            const n = experimentalUseLakhCrore ? 2 : 3;
            for (let i = -3, len = -intPart.length; i > len; i -= n) {
                groups.unshift(intPart.slice(-n + i, i), groupSeparator);
            }
            buffer.push(...groups);
        }
        // fractional part
        if (ndigits > 0) {
            buffer.push(decimalSeparator, String(absNum % decimal.den).padStart(ndigits, "0"));
        }
        // format
        const [tplPositive, tplNegative, tplZero] = templates;
        let tplToUse = tplPositive;
        if (decimal.num < 0n) {
            tplToUse = tplNegative == null ? `-${tplPositive}` : tplNegative;
        }
        else if (decimal.num === 0n) {
            tplToUse = tplZero == null ? tplPositive : tplZero;
        }
        const result = tplToUse.replace("{}", buffer.join(""));
        if (result.includes("{}")) {
            // refuse multiple {} for future expansion
            throw new SyntaxError("template string includes multiple {}");
        }
        return result;
    }
}
exports.BigAmount = BigAmount;
/**
 * Creates a {@link BigAmount} from various arguments. This is a synonym for
 * {@link BigAmount.create}.
 */
exports.q = BigAmount.create;
const PATTERN_FRACTION = /^([^/]+)\/([^/]+)$/;
const PATTERN_INTEGER = /^\s*(?:[-+]?[0-9]+|0x[0-9a-f]+|0o[0-7]+|0b[01]+)\s*$/i;
const PATTERN_DECIMAL = /^\s*([-+]?)(?:([0-9]*)\.([0-9]+)|([0-9]+))(?:e([-+]?[0-9]+))?\s*$/i;
/**
 * Calculates the greatest common divisor of two integers. The result is always
 * positive.
 */
const findGcd = (x, y) => {
    if (typeof x !== "bigint" || typeof y !== "bigint") {
        throw new TypeError("x or y is not a bigint");
    }
    // Euclidean algorithm
    x = x < 0n ? -x : x;
    y = y < 0n ? -y : y;
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
/** Performs integer division using the specified rounding mode. */
const divInt = (num, den, roundingMode) => {
    if (den < 0n) {
        num = -num;
        den = -den;
    }
    if (den === 1n) {
        return num;
    }
    const quot = num / den;
    const rem = (num < 0n ? -num : num) % den;
    if (rem === 0n) {
        return quot;
    }
    const unit = num < 0n ? -1n : 1n;
    switch (roundingMode) {
        case "HALF_EVEN":
            return rem * 2n > den || (rem * 2n === den && (quot & 1n) === 1n)
                ? quot + unit
                : quot;
        case "HALF_UP":
            return rem * 2n >= den ? quot + unit : quot;
        case "UP":
            return quot + unit;
        case "DOWN":
            return quot;
        case "CEIL":
            return unit > 0n ? quot + unit : quot;
        case "FLOOR":
            return unit < 0n ? quot + unit : quot;
        default:
            // Unreachable in TypeScript
            // NOTE: Not intended to verify argument (not invoked if rem === 0n)
            throw new RangeError(`unknown roundingMode: ${roundingMode}`);
    }
};
