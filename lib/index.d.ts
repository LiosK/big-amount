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
export declare class BigAmount {
    /** Numerator. */
    readonly num: bigint;
    /** Denominator. */
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
     * Note that non-integer `number` values have to be passed as `string`.
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
     *    expensive to find a rational approximate of a floating-point number.
     *    Pass the number as a string (e.g. `"1/3"`, `"1.23"`) to create an exact
     *    value or use [[BigAmount.fromNumber]] to find an approximate.
     * -  `string` - Rational (`"1/23"`), integer (`"123"`, `"0xFF"`), decimal
     *    fraction (`"-1.23"`, `".123"`), or scientific (`"1.23e-4"`, `"-12e+3"`).
     *    The rational notation `q("num/den")` is equivalent to `q("num", "den")`.
     *
     * @category Instance Creation
     */
    static create(x: BigAmount | bigint | number | string, y?: BigAmount | bigint | number | string): BigAmount;
    /**
     * Creates a [[BigAmount]] from `number`. Unlike [[BigAmount.create]], this
     * method finds a rational approximate of a non-integer finite number.
     *
     * @category Instance Creation
     */
    static fromNumber(x: number, precision?: number): BigAmount;
    /**
     * Creates a [[BigAmount]] instance of the sum of values in a list.
     *
     * @example
     * ```javascript
     * BigAmount.sum(["123/100", "-456/100", "789/100"]); // 456/100
     * ```
     *
     * @param xs - Array of values that are acceptable by [[BigAmount.create]].
     * @category Instance Creation
     */
    static sum(xs: Array<BigAmount | bigint | number | string>): BigAmount;
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
     * rational number because the methods in this class by design do not return
     * the irreducible form of the result.
     *
     * @category Arithmetic Operation
     */
    reduce(): BigAmount;
    /**
     * Returns an approximate of `this` that has the specified denominator. This
     * method rounds the numerator in the specified rounding mode if it is not
     * divisible by the new denominator.
     *
     * @example Rounding a repeating decimal to a fixed-digit decimal
     * ```javascript
     * let x = BigAmount.create("1/3"); // 1/3 = 0.333333...
     * x.changeDenominator(100n);       // 33/100 = 0.33
     * ```
     *
     * @remarks
     * Note that the [[RoundingMode]] applies to the resulting numerator; the
     * outcome of "toward positive / negative" is determined by the sign of
     * numerator, which could be counterintuitive when the new denominator is
     * negative.
     *
     * @category Arithmetic Operation
     */
    changeDenominator(newDen: bigint, roundingMode?: RoundingMode): BigAmount;
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
    /** @category Conversion */
    toString(): string;
    /** @category Conversion */
    toJSON(): string;
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
    toFixed(digits?: number, { decimalSeparator, groupSeparator, roundingMode, }?: {
        decimalSeparator?: string;
        groupSeparator?: string;
        roundingMode?: RoundingMode;
    }): string;
}
/** Shortcut for [[BigAmount.create]] */
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
