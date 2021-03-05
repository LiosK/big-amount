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
 *   templates: ["${}", "(${})"],
 * });
 * console.log(s); // "($7,399,325.32)"
 * ```
 */
export declare class BigAmount {
    /** Raw numerator. */
    readonly num: bigint;
    /** Raw denominator. */
    readonly den: bigint;
    /** Creates a [[BigAmount]] from a pair of integers. */
    constructor(numerator: bigint, denominator: bigint);
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
     * -  `bigint` - Any `bigint` value.
     * -  `number` - _Integer only._ This is because it is often imprecise and
     *    expensive to find a rational approximate of a non-integral number.
     *    Pass the number as a string (e.g. `"1/3"`, `"1.23"`) to create an exact
     *    value or use [[BigAmount.fromNumber]] to find an approximate.
     * -  `string` - Fraction (`"1/23"`), integer (`"123"`, `"0xFF"`), decimal
     *    (`"-1.23"`, `".123"`), or scientific (`"1.23e-4"`, `"-12e+3"`). The
     *    fractional notation `q("num/den")` is equivalent to `q("num", "den")`.
     * - `object` - Any object that has two `bigint` fields named `num` and `den`,
     *   including any [[BigAmount]] value.
     *
     * @category Instance Creation
     */
    static create(x: bigint | number | string | {
        num: bigint;
        den: bigint;
    }, y?: bigint | number | string | {
        num: bigint;
        den: bigint;
    }): BigAmount;
    /**
     * Creates a [[BigAmount]] from `number`. Unlike [[BigAmount.create]], this
     * method finds a rational approximate of a non-integral number.
     *
     * @category Instance Creation
     */
    static fromNumber(x: number, precision?: number): BigAmount;
    /**
     * Creates a [[BigAmount]] instance of the sum of list items.
     *
     * @example
     * ```javascript
     * BigAmount.sum(["123/100", "-456/100", "789/100"]); // 456/100
     * ```
     *
     * @param xs - Array of values that [[BigAmount.create]] accepts.
     * @category Instance Creation
     */
    static sum(xs: Array<bigint | number | string | {
        num: bigint;
        den: bigint;
    }>): BigAmount;
    /**
     * Returns a copy of `this`.
     *
     * @category Instance Creation
     */
    clone(): BigAmount;
    /**
     * Returns the sign of `this`.
     *
     * @returns `1n` if positive, `-1n` if negative, `0n` if zero.
     */
    sign(): bigint;
    /** Returns true if `this` is an integer. */
    isInteger(): boolean;
    /**
     * Compares two [[BigAmount]]s. This method coordinates with `Array#sort`.
     *
     * @returns `-1` if `x` is less than `y`, `0` if `x` equals to `y`, or `1` if
     *          `x` is greater than `y`.
     * @category Comparison
     */
    static cmp(x: BigAmount, y: BigAmount): number;
    /**
     * Returns true if `this` is an equivalent fraction to `other`.
     *
     * @category Comparison
     */
    eq(other: BigAmount): boolean;
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
    reduce(): BigAmount;
    /**
     * Performs the unary `-` operation.
     *
     * @category Arithmetic Operation
     */
    neg(): BigAmount;
    /**
     * Returns the unsigned absolute value of `this`.
     *
     * @category Arithmetic Operation
     */
    abs(): BigAmount;
    /**
     * Returns the reciprocal of `this`.
     *
     * @category Arithmetic Operation
     */
    inv(): BigAmount;
    /**
     * Adds `other` to `this`.
     *
     * @category Arithmetic Operation
     */
    add(other: BigAmount): BigAmount;
    /**
     * Subtracts `other` from `this`.
     *
     * @category Arithmetic Operation
     */
    sub(other: BigAmount): BigAmount;
    /**
     * Multiplies `this` by `other`.
     *
     * @category Arithmetic Operation
     */
    mul(other: BigAmount): BigAmount;
    /**
     * Divides `this` by `other`.
     *
     * @category Arithmetic Operation
     */
    div(other: BigAmount): BigAmount;
    /**
     * Adds `others` to `this`. This method is conceptually equivalent to
     * `f.add(others[0]).add(others[1])...`, except for some optimization for a
     * batch operation.
     *
     * @remarks
     * Currently, this method is implemented to perform well if the denominators
     * of `others` do not vary greatly; this method first sums `others` by
     * denominator (which mathematically requires simple addition of BigInts only)
     * and then aggregates the subtotals. Therefore, it is recommended to
     * standardize the denominators of `others` when they are expected to vary
     * substantially. If the denominators of `others` differ element-by-element,
     * `f.add(others[0]).reduce().add(others[1]).reduce()...` often outperforms
     * this method by keeping the intermediate numerators and denominators smaller
     * because computations on huge BigInts tend to be very slow.
     *
     * @category Arithmetic Operation
     */
    batchAdd(others: BigAmount[]): BigAmount;
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
     * Note that the [[RoundingMode]] applies to the resulting numerator; the
     * outcome of "toward positive / negative" is determined by the sign of
     * numerator, which could be counterintuitive when the new denominator is
     * negative.
     *
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    quantize(newDen: bigint, roundingMode?: RoundingMode): BigAmount;
    /**
     * Same as [[BigAmount.quantize]] but returns `undefined` if the numerator
     * needs to be rounded.
     *
     * @category Conversion
     */
    tryQuantize(newDen: bigint): BigAmount | undefined;
    /**
     * Returns a fractional approximate of `this` that is rounded to the multiple
     * of `1 / (10 ** ndigits)`, just like Python's built-in `round()`. This
     * method rounds ties to even by default.
     *
     * @param ndigits - Number of digits after the decimal separator.
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    round(ndigits?: number, roundingMode?: RoundingMode): BigAmount;
    /**
     * Returns an integral approximate of `this`, rounding ties to even by
     * default.
     *
     * @param roundingMode - See [[RoundingMode]] for rounding mode options.
     * @category Conversion
     */
    roundToInt(roundingMode?: RoundingMode): bigint;
    /** @category Conversion */
    toString(): string;
    /** @category Conversion */
    toJSON(): string;
    /**
     * Returns `this` as a `number`.
     *
     * @category Conversion
     */
    toNumber(): number;
    /**
     * Formats a [[BigAmount]] using decimal fixed-point notation just like
     * `Number#toFixed`. In addition, this method takes format options to
     * customize the output. See [[FormatOptions]] for options and examples.
     *
     * @param ndigits - Number of digits to appear after the decimal separator.
     * @category Conversion
     */
    toFixed(ndigits?: number, formatOptions?: FormatOptions): string;
}
/**
 * Creates a [[BigAmount]] from various arguments. This is a synonym for
 * [[BigAmount.create]].
 */
export declare const q: typeof BigAmount.create;
/**
 * Represents rounding modes.
 *
 * @remarks
 * | Value         | Mode                                  |
 * | ------------- | ------------------------------------- |
 * | `"UP"`        | Toward inifinity (away from zero)     |
 * | `"DOWN"`      | Toward zero                           |
 * | `"CEIL"`      | Toward positive                       |
 * | `"FLOOR"`     | Toward negative                       |
 * | `"HALF_UP"`   | Ties toward infinity (away from zero) |
 * | `"HALF_EVEN"` | Ties to even                          |
 */
export declare type RoundingMode = "UP" | "DOWN" | "CEIL" | "FLOOR" | "HALF_UP" | "HALF_EVEN";
/**
 * Options used by [[BigAmount.toFixed]] to format a [[BigAmount]] as decimal.
 *
 * @example
 * ```javascript
 * let f = BigAmount.create("123456789/10");
 * f.toFixed(2);                            // "12345678.90"
 * f.toFixed(2, { decimalSeparator: "," }); // "12345678,90"
 * f.toFixed(2, { groupSeparator: "," });   // "12,345,678.90"
 * f.neg().toFixed(2, {
 *   decimalSeparator: ",",
 *   groupSeparator: " ",
 *   templates: ["{} €"],
 * });                                      // "-12 345 678,90 €"
 *
 * const opts = { templates: ["${}", "(${})", "-"] };
 * BigAmount.create("123.45").toFixed(2, opts); // "$123.45"
 * BigAmount.create("-678.9").toFixed(2, opts); // "($678.90)"
 * BigAmount.create("0").toFixed(2, opts);      // "-"
 * ```
 */
export interface FormatOptions {
    /**
     * [Default: `"."`] Character used to separate the integer part from the
     * fractional part.
     */
    decimalSeparator?: string;
    /**
     * [Default: `""`] Delimiter used to separate the groups of thousands (three
     * digits) of the integer part. Grouping is disabled by default; give `","`,
     * `"."`, `" "`, or any other delimiter to enable grouping.
     */
    groupSeparator?: string;
    /**
     * [Default: `["{}"]`] Tuple of template strings used to format `[positive
     * numbers, negative numbers, zero]`, respectively. `"{}"` in a template
     * string is replaced with the resulting string. The template for zero
     * defaults to the template for positive numbers and the template for negative
     * numbers defaults to the template for positive numbers with the prefix `"-"`,
     * if omitted. This option is convenient to decorate the resulting string with
     * a currency symbol and/or negative parenstheses. See the above example for
     * usage.
     */
    templates?: [string, string?, string?];
    /**
     * [Default: `false`] _Experimental_. Use Indian _2,2,3_ digit grouping rule
     * (e.g. `"1,00,00,000"`) instead of the three digit system. This option has
     * to be used in conjunction with the `groupSeparator` option.
     */
    experimentalUseLakhCrore?: boolean;
}
