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
 * ```
 * import { q, BigAmount } from "big-amount";
 *
 * let x = q("1/2")            // Equivalent to BigAmount.create("1/2")
 *   .ineg()                   // Negation
 *   .iabs()                   // Absolute value
 *   .iinv()                   // Reciprocal
 *   .iadd(q("34.5"))          // Addition
 *   .isub(q(".67"))           // Subtraction
 *   .imul(q(-8n, 9n))         // Multiplication
 *   .idiv(q(10))              // Division
 *   .ireduce();               // Reduction to the simplest form
 *
 * console.log(x.toString());  // "-3583/1125"
 * console.log(x.toFixed(6));  // "-3.184889"
 * ```
 */
export declare class BigAmount {
    num: bigint;
    den: bigint;
    /**
     * Creates a [[BigAmount]] without validating arguments. It is highly
     * recommended to use [[BigAmount.create]] instead.
     *
     * @param num - Numerator.
     * @param den - Denominator.
     */
    constructor(num: bigint, den: bigint);
    /**
     * Creates a [[BigAmount]] from various arguments. For convenience, this
     * method is also exported as [[q]] and is callable as `q(x)` and `q(x, y)`.
     *
     * @example `BigAmount.create(x)` creates an instance representing _x/1_.
     * ```
     * q(123n)          // 123/1
     * q(123)           // 123/1
     * q("123")         // 123/1
     * q("123.45")      // 12345/100
     * q("123.45e-6")   // 12345/100000000
     *
     * q("123/45")      // 123/45
     * q("12.3/-4.5")   // 1230/-450
     * ```
     *
     * Note that non-integer `number` values have to be passed as `string`.
     *
     * ```
     * q(123.45)        // ERROR!
     * q(123/45)        // ERROR!
     * ```
     *
     * @example `BigAmount.create(x, y)` creates an instance representing _x/y_.
     * ```
     * q(123n, 45n)     // 123/45
     * q(123, 45)       // 123/45
     *
     * q(123, 45n)      // 123/45
     * q(123n, "4.5")   // 1230/45
     *
     * q("1/2", "3/4")  // 4/6
     * q("1/2", "3.4")  // 10/68
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
     */
    static create(x: BigAmount | bigint | number | string, y?: BigAmount | bigint | number | string): BigAmount;
    /**
     * Creates a [[BigAmount]] from `Number`. Unlike [[BigAmount.create]], this
     * method finds a rational approximate of non-integer finite number.
     */
    static fromNumber(x: number, precision?: number): BigAmount;
    /** Returns a copy of `this`. */
    clone(): BigAmount;
    /**
     * Asserts that `this` is composed of `BigInt` values and the denominator is
     * non-zero.
     *
     * @returns `this`.
     */
    private verify;
    /**
     * Converts `this` to the simplest form with a positive denominator.
     *
     * @remarks
     * This method has to be called explicitly to obtain the canonical form of a
     * fraction because most of the methods in this class do not reduce the result
     * automatically.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    ireduce(): this;
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
     * ```
     * let x = BigAmount.create("1/3"); // 1/3 = 0.333333...
     * x.ichangeDenominator(100n);      // 33/100 = 0.33
     * ```
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    ichangeDenominator(newDen: bigint, roundingMode?: RoundingMode): this;
    /**
     * Compares two [[BigAmount]]s. This method coordinates with `Array#sort`.
     *
     * @returns `-1` if `x` is less than `y`, `0` if `x` equals to `y`, or `1` if
     *          `x` is greater than `y`.
     */
    static cmp(x: BigAmount, y: BigAmount): number;
    /** Returns true if `this` is an equivalent fraction to `other`. */
    eq(other: BigAmount): boolean;
    /**
     * Negates `this`.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    ineg(): this;
    /**
     * Converts `this` into the unsigned absolute value.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    iabs(): this;
    /**
     * Converts `this` into the reciprocal (i.e. inverses the numerator and
     * denominator).
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    iinv(): this;
    /**
     * Adds `other` to `this`.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    iadd(other: BigAmount): this;
    /**
     * Subtracts `other` from `this`.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    isub(other: BigAmount): this;
    /**
     * Multiplies `this` by `other`.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    imul(other: BigAmount): this;
    /**
     * Divides `this` by `other`.
     *
     * @returns Mutated `this`; this method operates _in place_.
     */
    idiv(other: BigAmount): this;
    /**
     * Returns the sign of `this`.
     *
     * @returns `1n` if positive, `-1n` if negative, `0n` if zero.
     */
    sign(): bigint;
    toString(): string;
    toJSON(): string;
    /**
     * Formats a [[BigAmount]] using decimal fixed-point notation just like
     * `Number#toFixed`. This method additionally takes rounding and formatting
     * options to customize the output.
     *
     * @example
     * ```
     * let x = BigAmount.create("12345678.9");
     * x.toFixed(2);                              // "12345678.90"
     * x.toFixed(2, { decimalSeparator: "," });   // "12345678,90"
     * x.toFixed(2, { groupSeparator: "," });     // "12,345,678.90"
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
 * | Value          | Mode                                  |
 * |----------------|---------------------------------------|
 * | `"UP"`         | Toward inifinity (away from zero)     |
 * | `"DOWN"`       | Toward zero                           |
 * | `"CEIL"`       | Toward positive                       |
 * | `"FLOOR"`      | Toward negative                       |
 * | `"HALF_UP"`    | Ties toward infinity (away from zero) |
 * | `"HALF_EVEN"`  | Ties to even                          |
 */
export declare type RoundingMode = "UP" | "DOWN" | "CEIL" | "FLOOR" | "HALF_UP" | "HALF_EVEN";
