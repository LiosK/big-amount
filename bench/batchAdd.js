import { q } from "../dist/index.js";

const tests = {};

// Prepare inputs
const pairs = [];
for (let i = 0; i < 1_000_000; i++) {
  pairs.push([
    Math.round((Math.random() - 0.5) * 2_000_000),
    Math.round((Math.random() - 0.5) * 2_000_000) || 1,
  ]);
}

tests["add(q(num, 1000)).add..."] = (name) => {
  const xs = pairs.map(([n]) => q(BigInt(n), 1000n));

  console.time(name);
  let acc = q(0n, 1000n);
  for (const x of xs) {
    acc = acc.add(x);
  }
  console.timeEnd(name);
};

tests["batchAdd([q(num, 1000), ...])"] = (name) => {
  const xs = pairs.map(([n]) => q(BigInt(n), 1000n));

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

tests["batchAdd([q(num, 10 ** [0-15]), ...])"] = (name) => {
  const xs = pairs.map(([n]) =>
    q(BigInt(n), 10n ** BigInt(Math.floor(Math.random() * 16)))
  );

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

tests["batchAdd([q(num, [-1_dd0_000-1_dd0_000]), ...])"] = (name) => {
  const xs = pairs.map(([n, d]) =>
    q(BigInt(n), (BigInt(d) / 10000n || 1n) * 10000n)
  );

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

tests["batchAdd([q(num, [-1_ddd_000-1_ddd_000]), ...])"] = (name) => {
  const xs = pairs.map(([n, d]) =>
    q(BigInt(n), (BigInt(d) / 1000n || 1n) * 1000n)
  );

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

tests["batchAdd([q(num, [-1_ddd_d00-1_ddd_d00]), ...])"] = (name) => {
  const xs = pairs.map(([n, d]) =>
    q(BigInt(n), (BigInt(d) / 100n || 1n) * 100n)
  );

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

tests["batchAdd([q(num, [-1_ddd_dd0-1_ddd_dd0]), ...])"] = (name) => {
  const xs = pairs.map(([n, d]) => q(BigInt(n), (BigInt(d) / 10n || 1n) * 10n));

  console.time(name);
  q(0n, 1000n).batchAdd(xs);
  console.timeEnd(name);
};

// Run
console.group("batchAdd.js");
for (const [name, test] of Object.entries(tests)) {
  test(name);
}
console.groupEnd("batchAdd.js");
