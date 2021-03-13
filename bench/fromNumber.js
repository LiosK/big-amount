import { q, BigAmount } from "../dist/index.js";

const tests = {};

// Prepare inputs
const ns = [];
for (let i = 0; i < 1_000_000; i++) {
  ns.push(Math.random());
}

tests["BigAmount.fromNumber(random[0, 1))"] = (name) => {
  console.time(name);
  for (const x of ns) {
    BigAmount.fromNumber(x);
  }
  console.timeEnd(name);
};

tests["BigAmount.fromNumber(random(-1000, 1000))"] = (name) => {
  const xs = ns.map((n) => (n - 0.5) * 2000);

  console.time(name);
  for (const x of xs) {
    BigAmount.fromNumber(x);
  }
  console.timeEnd(name);
};

tests["BigAmount.create(String(random(-1000, 1000)))"] = (name) => {
  const xs = ns.map((n) => String((n - 0.5) * 2000));

  console.time(name);
  for (const x of xs) {
    BigAmount.create(x);
  }
  console.timeEnd(name);
};

tests["BigAmount.fromNumber(p / q) where p, q < 2048"] = (name) => {
  const xs = [];
  for (let p = 0; p < 2048; p++) {
    for (let q = 1; q < 2048; q++) {
      xs.push(p / q);
    }
  }

  console.time(name);
  for (const x of xs) {
    BigAmount.fromNumber(x);
  }
  console.timeEnd(name);
};

// Run
console.group("fromNumber.js");
for (const [name, test] of Object.entries(tests)) {
  test(name);
}
console.groupEnd("fromNumber.js");
