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
     * Creates a [[BigAmount]].
     *
     * @param x - Single value that is convertible to a [[BigAmount]], or a
     *        numerator if given together with `y`.
     * @param y - Optional denominator.
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
     * @returns Mutated `this`; this method operates in-place.
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
     * @returns Mutated `this`; this method operates in-place.
     */
    ichangeDenominator(newDen: bigint, roundingMode?: RoundingMode): this;
    /** Returns true if `this` is an equivalent fraction to `other`. */
    eq(other: BigAmount): boolean;
    /**
     * Negates `this`.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    ineg(): this;
    /**
     * Converts `this` into the unsigned absolute value.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    iabs(): this;
    /**
     * Converts `this` into the reciprocal (i.e. inverses the numerator and
     * denominator).
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    iinv(): this;
    /**
     * Adds `other` to `this`.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    iadd(other: BigAmount): this;
    /**
     * Subtracts `other` from `this`.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    isub(other: BigAmount): this;
    /**
     * Multiplies `this` by `other`.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    imul(other: BigAmount): this;
    /**
     * Divides `this` by `other`.
     *
     * @returns Mutated `this`; this method operates in-place.
     */
    idiv(other: BigAmount): this;
    toString(): string;
    toJSON(): string;
    /**
     * Formats a [[BigAmount]] using decimal fixed-point notation just like
     * `Number#toFixed`. This method additionally takes rounding and formatting
     * options to customize the output.
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
//# sourceMappingURL=index.d.ts.map