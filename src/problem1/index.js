/**
 * Problem 1: Three ways to sum to n
 *
 * sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 *
 * Assumptions:
 * - `n` is an integer and the result is lesser than Number.MAX_SAFE_INTEGER.
 * - sum_to_n(0) === 0.
 * - For negative `n`, the sum runs from -1 down to n,
 *   i.e. sum_to_n(-5) === -1 + -2 + -3 + -4 + -5 === -15
 *   (so sum_to_n(-n) === -sum_to_n(n)).
 */

/**
 * Validates input; throws on non-integer values.
 * @param {number} n
 */
function assertInteger(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError(`Expected an integer, received: ${n}`);
  }
}

/**
 * A) Closed-form (Gauss) formula.
 *
 * Time: O(1) | Space: O(1)
 *
 * Divides the even factor by 2 *before* multiplying, so the intermediate
 * value never exceeds the final result. A naive `n * (n + 1) / 2` could
 * overflow MAX_SAFE_INTEGER even when the final result is safe.
 *
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_a = function (n) {
  assertInteger(n);
  const sign = Math.sign(n);
  const m = Math.abs(n);
  const sum = m % 2 === 0 ? (m / 2) * (m + 1) : m * ((m + 1) / 2);
  return sign * sum || 0; // `|| 0` normalizes -0 to 0
};

/**
 * B) Iterative loop.
 *
 * Time: O(n) | Space: O(1)
 *
 * Simple and readable; no recursion, no extra allocations.
 *
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_b = function (n) {
  assertInteger(n);
  const step = n < 0 ? -1 : 1;
  let sum = 0;
  for (let i = step; Math.abs(i) <= Math.abs(n); i += step) {
    sum += i;
  }
  return sum;
};

/**
 * C) Divide & conquer recursion.
 *
 * Time: O(n) | Space: O(log n) call stack
 *
 * Splits the range [low, high] in half and sums each half recursively.
 * Unlike naive recursion (`n + sum(n - 1)`, which has O(n) depth and
 * blows the stack around n ≈ 10^4), depth here is only ~log2(n),
 * so it is safe for any n whose result fits in a safe integer.
 *
 * @param {number} n
 * @returns {number}
 */
var sum_to_n_c = function (n) {
  assertInteger(n);
  if (n === 0) return 0;

  const sumRange = (low, high) => {
    if (low > high) return 0;
    if (low === high) return low;
    const mid = Math.floor((low + high) / 2);
    return sumRange(low, mid) + sumRange(mid + 1, high);
  };

  return n > 0 ? sumRange(1, n) : sumRange(n, -1);
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
