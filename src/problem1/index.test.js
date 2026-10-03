// Run with: node --test src/problem1/index.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./index');

const implementations = { sum_to_n_a, sum_to_n_b, sum_to_n_c };

const cases = [
  [0, 0],
  [1, 1],
  [2, 3],
  [5, 15],
  [10, 55],
  [100, 5050],
  [-1, -1],
  [-5, -15],
  [-100, -5050],
];

for (const [name, fn] of Object.entries(implementations)) {
  test(`${name}: basic cases`, () => {
    for (const [input, expected] of cases) {
      assert.equal(fn(input), expected, `${name}(${input})`);
    }
  });

  test(`${name}: large n without stack overflow`, () => {
    assert.equal(fn(1_000_000), 500_000_500_000);
  });

  test(`${name}: rejects non-integer input`, () => {
    assert.throws(() => fn(1.5), TypeError);
    assert.throws(() => fn('5'), TypeError);
    assert.throws(() => fn(NaN), TypeError);
  });
}

test('formula is exact near MAX_SAFE_INTEGER', () => {
  // Largest n with n(n+1)/2 <= MAX_SAFE_INTEGER is 134217727.
  // Naive n * (n + 1) / 2 would exceed MAX_SAFE_INTEGER in the intermediate step.
  const n = 134_217_727;
  assert.equal(BigInt(sum_to_n_a(n)), (BigInt(n) * BigInt(n + 1)) / 2n);
});

test('all implementations agree on random inputs', () => {
  for (let i = 0; i < 200; i++) {
    const n = Math.floor(Math.random() * 20_001) - 10_000;
    const a = sum_to_n_a(n);
    assert.equal(sum_to_n_b(n), a);
    assert.equal(sum_to_n_c(n), a);
  }
});
