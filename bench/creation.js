import { q, BigAmount } from "../dist/index.js";

const tests = {};

// Prepare inputs
const pairs = [];
for (let i = 0; i < 1_000_000; i++) {
  pairs.push([
    Math.round((Math.random() - 0.5) * 2_000_000),
    Math.round((Math.random() - 0.5) * 2_000_000) || 1,
  ]);
}

tests["new BigAmount(bigint, bigint)"] = (name) => {
  const xs = pairs.map(([n, d]) => [BigInt(n), BigInt(d)]);

  console.time(name);
  for (const [n, d] of xs) {
    new BigAmount(n, d);
  }
  console.timeEnd(name);
};

tests["q(bigint, bigint)"] = (name) => {
  const xs = pairs.map(([n, d]) => [BigInt(n), BigInt(d)]);

  console.time(name);
  for (const [n, d] of xs) {
    q(n, d);
  }
  console.timeEnd(name);
};

tests["q(number, number)"] = (name) => {
  console.time(name);
  for (const [n, d] of pairs) {
    q(n, d);
  }
  console.timeEnd(name);
};

tests["q({ num: bigint, den: bigint })"] = (name) => {
  const xs = pairs.map(([n, d]) => ({ num: BigInt(n), den: BigInt(d) }));

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests["q({ num: number, den: number })"] = (name) => {
  const xs = pairs.map(([n, d]) => ({ num: n, den: d }));

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests["q({ num: string, den: string })"] = (name) => {
  const xs = pairs.map(([n, d]) => ({ num: String(n), den: String(d) }));

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests['q("num/den")'] = (name) => {
  const xs = pairs.map(([n, d]) => `${n}/${d}`);

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests['q("num/1000")'] = (name) => {
  const xs = pairs.map(([n]) => `${n}/1000`);

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests['q("d.ddd")'] = (name) => {
  const xs = pairs.map(([n]) => (n / 1000).toFixed(3));

  console.time(name);
  for (const x of xs) {
    q(x);
  }
  console.timeEnd(name);
};

tests["BigAmount.fromNumber(d.ddd)"] = (name) => {
  const xs = pairs.map(([n]) => n / 1000);

  console.time(name);
  for (const x of xs) {
    BigAmount.fromNumber(x);
  }
  console.timeEnd(name);
};

// Run
console.group("creation.js");
for (const [name, test] of Object.entries(tests)) {
  test(name);
}
console.groupEnd("creation.js");
