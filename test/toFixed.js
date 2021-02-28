import { BigAmount } from "../lib/index.js";
const assert = chai.assert;

describe("#toFixed()", () => {
  it("agrees with `Number#toFixed()`, except -0 and rounding", () => {
    const patNegZero = /^-(0(?:\.0+)?)$/;
    const cases = [0, 1, -1, 12345678, -12345678];
    for (const e of cases) {
      const b = BigInt(e);
      for (let den = 1; den < 100_000_000_000; den *= 10) {
        const n = e / den;
        const f = new BigAmount(b, BigInt(den));
        for (let ndigits = 0; ndigits < 10; ndigits++) {
          let expected = n.toFixed(ndigits);
          const match = expected.match(patNegZero);
          if (match) {
            expected = match[1];
          }
          assert.strictEqual(f.toFixed(ndigits), expected);
        }
      }
    }
  });

  it("formats fractions with arbitrary denominators", () => {
    const cases = [
      Math.E,
      Math.LN2,
      Math.LN10,
      Math.LOG2E,
      Math.LOG10E,
      Math.PI,
      Math.SQRT1_2,
      Math.SQRT2,
    ];

    for (const e of cases) {
      const f = BigAmount.fromNumber(e);
      for (let ndigits = 0; ndigits < 10; ndigits++) {
        assert.strictEqual(f.toFixed(ndigits), e.toFixed(ndigits));
      }
    }
  });

  it("handles `decimalSeparator` and `groupSeparator` options as expected", () => {
    const f = (den, ds) =>
      new BigAmount(12345678n, den).toFixed(ds, {
        decimalSeparator: "{ds}",
        groupSeparator: "{gs}",
      });

    assert.strictEqual(f(1n, 0), "12{gs}345{gs}678");
    assert.strictEqual(f(-1n, 0), "-12{gs}345{gs}678");

    assert.strictEqual(f(1n, 9), "12{gs}345{gs}678{ds}000000000");
    assert.strictEqual(f(10n, 9), "1{gs}234{gs}567{ds}800000000");
    assert.strictEqual(f(100n, 9), "123{gs}456{ds}780000000");
    assert.strictEqual(f(1000n, 9), "12{gs}345{ds}678000000");
    assert.strictEqual(f(10000n, 9), "1{gs}234{ds}567800000");
    assert.strictEqual(f(100000n, 9), "123{ds}456780000");
    assert.strictEqual(f(1000000n, 9), "12{ds}345678000");
    assert.strictEqual(f(10000000n, 9), "1{ds}234567800");
    assert.strictEqual(f(100000000n, 9), "0{ds}123456780");
    assert.strictEqual(f(1000000000n, 9), "0{ds}012345678");
    assert.strictEqual(f(-1n, 9), "-12{gs}345{gs}678{ds}000000000");
    assert.strictEqual(f(-10n, 9), "-1{gs}234{gs}567{ds}800000000");
    assert.strictEqual(f(-100n, 9), "-123{gs}456{ds}780000000");
    assert.strictEqual(f(-1000n, 9), "-12{gs}345{ds}678000000");
    assert.strictEqual(f(-10000n, 9), "-1{gs}234{ds}567800000");
    assert.strictEqual(f(-100000n, 9), "-123{ds}456780000");
    assert.strictEqual(f(-1000000n, 9), "-12{ds}345678000");
    assert.strictEqual(f(-10000000n, 9), "-1{ds}234567800");
    assert.strictEqual(f(-100000000n, 9), "-0{ds}123456780");
    assert.strictEqual(f(-1000000000n, 9), "-0{ds}012345678");
  });

  it("handles `templates` option as expected", () => {
    const p = new BigAmount(12345n, 100n);
    const n = new BigAmount(-12345n, 100n);
    const z = new BigAmount(0n, 100n);

    let templates = ["__PP__{}__PS__"];
    assert.strictEqual(p.toFixed(2, { templates }), "__PP__123.45__PS__");
    assert.strictEqual(n.toFixed(2, { templates }), "-__PP__123.45__PS__");
    assert.strictEqual(z.toFixed(2, { templates }), "__PP__0.00__PS__");

    templates.push("__NP__{}__NS__");
    assert.strictEqual(p.toFixed(2, { templates }), "__PP__123.45__PS__");
    assert.strictEqual(n.toFixed(2, { templates }), "__NP__123.45__NS__");
    assert.strictEqual(z.toFixed(2, { templates }), "__PP__0.00__PS__");

    templates.push("__ZP__{}__ZS__");
    assert.strictEqual(p.toFixed(2, { templates }), "__PP__123.45__PS__");
    assert.strictEqual(n.toFixed(2, { templates }), "__NP__123.45__NS__");
    assert.strictEqual(z.toFixed(2, { templates }), "__ZP__0.00__ZS__");

    templates = ["__POSITIVE__"];
    assert.strictEqual(p.toFixed(2, { templates }), "__POSITIVE__");
    assert.strictEqual(n.toFixed(2, { templates }), "-__POSITIVE__");
    assert.strictEqual(z.toFixed(2, { templates }), "__POSITIVE__");

    templates.push("__NEGATIVE__");
    assert.strictEqual(p.toFixed(2, { templates }), "__POSITIVE__");
    assert.strictEqual(n.toFixed(2, { templates }), "__NEGATIVE__");
    assert.strictEqual(z.toFixed(2, { templates }), "__POSITIVE__");

    templates.push("__ZERO__");
    assert.strictEqual(p.toFixed(2, { templates }), "__POSITIVE__");
    assert.strictEqual(n.toFixed(2, { templates }), "__NEGATIVE__");
    assert.strictEqual(z.toFixed(2, { templates }), "__ZERO__");
  });

  it('throws SyntaxError if template includes multiple "{}"', () => {
    assert.throws(() => {
      new BigAmount(12345n, 100n).toFixed(2, { templates: ["{} {}"] });
    }, SyntaxError);

    assert.throws(() => {
      new BigAmount(-12345n, 100n).toFixed(2, { templates: ["{}", "{} {}"] });
    }, SyntaxError);

    assert.throws(() => {
      new BigAmount(0n, 100n).toFixed(2, { templates: ["{}", "-{}", "{} {}"] });
    }, SyntaxError);
  });

  it("handles `experimentalUseLakhCrore` option as expected", () => {
    const f = (den, ds) =>
      new BigAmount(12345678n, den).toFixed(ds, {
        decimalSeparator: "{ds}",
        groupSeparator: "{gs}",
        experimentalUseLakhCrore: true,
      });

    assert.strictEqual(f(1n, 0), "1{gs}23{gs}45{gs}678");
    assert.strictEqual(f(-1n, 0), "-1{gs}23{gs}45{gs}678");

    assert.strictEqual(f(1n, 9), "1{gs}23{gs}45{gs}678{ds}000000000");
    assert.strictEqual(f(10n, 9), "12{gs}34{gs}567{ds}800000000");
    assert.strictEqual(f(100n, 9), "1{gs}23{gs}456{ds}780000000");
    assert.strictEqual(f(1000n, 9), "12{gs}345{ds}678000000");
    assert.strictEqual(f(10000n, 9), "1{gs}234{ds}567800000");
    assert.strictEqual(f(100000n, 9), "123{ds}456780000");
    assert.strictEqual(f(1000000n, 9), "12{ds}345678000");
    assert.strictEqual(f(10000000n, 9), "1{ds}234567800");
    assert.strictEqual(f(100000000n, 9), "0{ds}123456780");
    assert.strictEqual(f(1000000000n, 9), "0{ds}012345678");
    assert.strictEqual(f(-1n, 9), "-1{gs}23{gs}45{gs}678{ds}000000000");
    assert.strictEqual(f(-10n, 9), "-12{gs}34{gs}567{ds}800000000");
    assert.strictEqual(f(-100n, 9), "-1{gs}23{gs}456{ds}780000000");
    assert.strictEqual(f(-1000n, 9), "-12{gs}345{ds}678000000");
    assert.strictEqual(f(-10000n, 9), "-1{gs}234{ds}567800000");
    assert.strictEqual(f(-100000n, 9), "-123{ds}456780000");
    assert.strictEqual(f(-1000000n, 9), "-12{ds}345678000");
    assert.strictEqual(f(-10000000n, 9), "-1{ds}234567800");
    assert.strictEqual(f(-100000000n, 9), "-0{ds}123456780");
    assert.strictEqual(f(-1000000000n, 9), "-0{ds}012345678");
  });

  it("returns expected results to documented examples", () => {
    const f = BigAmount.create("123456789/10");
    assert.strictEqual(f.toFixed(2), "12345678.90");
    assert.strictEqual(f.toFixed(2, { decimalSeparator: "," }), "12345678,90");
    assert.strictEqual(f.toFixed(2, { groupSeparator: "," }), "12,345,678.90");
    assert.strictEqual(
      f.neg().toFixed(2, {
        decimalSeparator: ",",
        groupSeparator: " ",
        templates: ["{} €"],
      }),
      "-12 345 678,90 €"
    );

    const opts = { templates: ["${}", "(${})", "-"] };
    assert.strictEqual(BigAmount.create("123.45").toFixed(2, opts), "$123.45");
    assert.strictEqual(
      BigAmount.create("-678.9").toFixed(2, opts),
      "($678.90)"
    );
    assert.strictEqual(BigAmount.create("0").toFixed(2, opts), "-");

    assert.strictEqual(
      BigAmount.sum([
        "2200811.81",
        "5954398.62",
        "-6217732.25",
        "-9336803.50",
      ]).toFixed(2, {
        groupSeparator: ",",
        templates: ["${}", "(${})"],
      }),
      "($7,399,325.32)"
    );
  });

  it("emulates toLocaleString() if configured properly", () => {
    const numbers = [0, 1, -1, 1.15, -1.15, 12345678.9, -12345678.9];

    // Generated using Node
    const expected = {
      // {{{
      "en-US": [
        "$0.00",
        "$1.00",
        "($1.00)",
        "$1.15",
        "($1.15)",
        "$12,345,678.90",
        "($12,345,678.90)",
      ],
      "zh-CN": [
        "¥0.00",
        "¥1.00",
        "(¥1.00)",
        "¥1.15",
        "(¥1.15)",
        "¥12,345,678.90",
        "(¥12,345,678.90)",
      ],
      "ja-JP": [
        "￥0",
        "￥1",
        "(￥1)",
        "￥1",
        "(￥1)",
        "￥12,345,679",
        "(￥12,345,679)",
      ],
      "de-DE": [
        "0,00 €",
        "1,00 €",
        "-1,00 €",
        "1,15 €",
        "-1,15 €",
        "12.345.678,90 €",
        "-12.345.678,90 €",
      ],
      "hi-IN": [
        "₹0.00",
        "₹1.00",
        "-₹1.00",
        "₹1.15",
        "-₹1.15",
        "₹1,23,45,678.90",
        "-₹1,23,45,678.90",
      ],
      "en-GB": [
        "£0.00",
        "£1.00",
        "(£1.00)",
        "£1.15",
        "(£1.15)",
        "£12,345,678.90",
        "(£12,345,678.90)",
      ],
      "fr-FR": [
        "0,00 €",
        "1,00 €",
        "(1,00 €)",
        "1,15 €",
        "(1,15 €)",
        "12 345 678,90 €",
        "(12 345 678,90 €)",
      ],
      "pt-BR": [
        "R$ 0,00",
        "R$ 1,00",
        "-R$ 1,00",
        "R$ 1,15",
        "-R$ 1,15",
        "R$ 12.345.678,90",
        "-R$ 12.345.678,90",
      ],
      "it-IT": [
        "0,00 €",
        "1,00 €",
        "-1,00 €",
        "1,15 €",
        "-1,15 €",
        "12.345.678,90 €",
        "-12.345.678,90 €",
      ],
      "en-CA": [
        "$0.00",
        "$1.00",
        "($1.00)",
        "$1.15",
        "($1.15)",
        "$12,345,678.90",
        "($12,345,678.90)",
      ],
      // }}}
    };

    const GENERATE_EXPECTED = false;
    if (GENERATE_EXPECTED) {
      const common = { style: "currency", currencySign: "accounting" };
      const localeOptions = {
        "en-US": { currency: "USD", ...common },
        "zh-CN": { currency: "CNY", ...common },
        "ja-JP": { currency: "JPY", ...common },
        "de-DE": { currency: "EUR", ...common },
        "hi-IN": { currency: "INR", ...common },
        "en-GB": { currency: "GBP", ...common },
        "fr-FR": { currency: "EUR", ...common },
        "pt-BR": { currency: "BRL", ...common },
        "it-IT": { currency: "EUR", ...common },
        "en-CA": { currency: "CAD", ...common },
      };
      for (const [locale, opts] of Object.entries(localeOptions)) {
        expected[locale] = numbers.map((x) => x.toLocaleString(locale, opts));
      }
    }

    // Beware of U+00A0 NBSP and U+202F NNBSP
    const configs = [
      // {{{
      ["en-US", 2, { groupSeparator: ",", templates: ["${}", "(${})"] }],
      ["zh-CN", 2, { groupSeparator: ",", templates: ["¥{}", "(¥{})"] }],
      ["ja-JP", 0, { groupSeparator: ",", templates: ["￥{}", "(￥{})"] }],
      [
        "de-DE",
        2,
        { decimalSeparator: ",", groupSeparator: ".", templates: ["{} €"] },
      ],
      [
        "hi-IN",
        2,
        {
          groupSeparator: ",",
          templates: ["₹{}"],
          experimentalUseLakhCrore: true,
        },
      ],
      ["en-GB", 2, { groupSeparator: ",", templates: ["£{}", "(£{})"] }],
      [
        "fr-FR",
        2,
        {
          decimalSeparator: ",",
          groupSeparator: " ",
          templates: ["{} €", "({} €)"],
        },
      ],
      [
        "pt-BR",
        2,
        {
          decimalSeparator: ",",
          groupSeparator: ".",
          templates: ["R$ {}"],
        },
      ],
      [
        "it-IT",
        2,
        {
          decimalSeparator: ",",
          groupSeparator: ".",
          templates: ["{} €"],
        },
      ],
      ["en-CA", 2, { groupSeparator: ",", templates: ["${}", "(${})"] }],
      // }}}
    ];

    const inputs = numbers.map((x) => BigAmount.create(x.toFixed(4)));
    for (const [locale, ndigits, formatOptions] of configs) {
      const actual = inputs.map((x) => x.toFixed(ndigits, formatOptions));
      assert.deepEqual(actual, expected[locale], locale);
    }
  });
});

// vim: fdm=marker fmr&
