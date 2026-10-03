# Problem 3: Messy React

A review of the `WalletPage` component, followed by a refactored version in [`index.tsx`](./index.tsx).

> Every compile error listed below was confirmed by running the original snippet through `tsc` with `strict` enabled (9 errors in total).

## Quick check

```bash
cd src/problem3
npm install
npm run typecheck   # tsc --noEmit (strict)
```

---

## 1. Bugs (the component is broken)

### 1.1 `lhsPriority` is not defined
```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { ... }
```
`lhsPriority` does not exist in this scope. It fails to compile (`TS2304: Cannot find name 'lhsPriority'`). If the code ran anyway, it would throw a `ReferenceError` on the first render. `balancePriority` is computed but never used. The intended variable is clearly `balancePriority`.

**Fix:** use the priority that was just computed.

### 1.2 `blockchain` is missing from `WalletBalance`
The code calls `balance.blockchain`, `lhs.blockchain` and `rhs.blockchain`, but the interface only declares `currency` and `amount`. This gives three `TS2339` errors.

**Fix:** add `blockchain` to the interface.

### 1.3 The filter logic is inverted
```ts
if (balancePriority > -99) {
  if (balance.amount <= 0) return true;   // keeps EMPTY / negative balances
}
return false;
```
This keeps only zero or negative balances and throws away every balance that actually holds funds. A wallet page should do the opposite and keep known chains with `amount > 0`. The nested `if`s also hide the intent.

**Fix:** `return priority > -99 && balance.amount > 0;`

### 1.4 `formattedBalances` is computed but never used, so `formatted` is always `undefined`
```ts
const formattedBalances = sortedBalances.map(...);       // never read
const rows = sortedBalances.map((balance: FormattedWalletBalance) => ...
  formattedAmount={balance.formatted}                    // undefined
```
`rows` maps over `sortedBalances`, not `formattedBalances`. The `FormattedWalletBalance` annotation is wrong: `tsc` reports `Property 'formatted' is missing`. As a result, every `WalletRow` receives `formattedAmount={undefined}`. The extra `.map()` is also wasted work and allocations on every render.

**Fix:** derive the formatted data once and render from it.

### 1.5 The sort comparator does not return a value when priorities are equal
```ts
if (left > right) return -1;
else if (right > left) return 1;
// no return here -> undefined
```
- TypeScript rejects it: `TS7030: Not all code paths return a value`, plus `TS2345` because the function's type is `1 | -1 | undefined`, which is not `number`.
- At runtime, `undefined` becomes `NaN`, which the spec treats as `0`. So it only works by accident, and the intent ("what happens on a tie?") is left unstated.

**Fix:** always return a number and add an explicit tie-break, e.g. `b.priority - a.priority || b.amount - a.amount`.

### 1.6 `toFixed()` without an argument rounds to 0 decimals
`balance.amount.toFixed()` is the same as `toFixed(0)`. For crypto amounts, `0.25 ETH` shows as `"0"` and `1.6` shows as `"2"`. It also ignores locale (no thousands separators).

**Fix:** use a module-level `Intl.NumberFormat` with sensible fraction digits.

### 1.7 Missing prices produce `NaN`
`prices[balance.currency] * balance.amount` evaluates to `NaN` (shown as "NaN" in the UI) whenever a token has no price yet, for example while prices are still loading.

**Fix:** `(prices[balance.currency] ?? 0) * balance.amount`, or hide the USD value when there is no price.

---

## 2. Computational inefficiencies

### 2.1 Unneeded `prices` dependency in `useMemo`
`sortedBalances` only reads `balances`, yet `prices` is in the dependency array. Prices usually change much more often than balances (polling or websocket ticks), so the list is filtered and re-sorted on every price tick for no reason. This is the opposite of what memoization is for.

**Fix:** depend on `[balances]` only. Put the price-dependent work (USD value) in its own step.

### 2.2 `getPriority` is called O(n log n) times
The comparator calls `getPriority` twice per comparison, and the filter has already called it once per item. The priority of an item never changes during the sort.

**Fix:** compute it once per item (*decorate → filter → sort → undecorate*), giving O(n) lookups. The `switch` can also become a constant lookup map.

### 2.3 `getPriority` is re-created on every render
It is a pure function that uses no props or state, but it is declared inside the component, so it is re-allocated on every render. It is also captured by `useMemo` without being listed in the dependencies, which triggers the `react-hooks/exhaustive-deps` warning.

**Fix:** move it (and the priority table) to module scope.

### 2.4 Redundant array passes and allocations
The original does `filter` → `sort` → `map` (`formattedBalances`, unused) → `map` (`rows`), and the last two run unmemoized on every render.

**Fix:** keep one memoized filter + sort keyed on `balances`, plus one cheap derivation step keyed on prices.

---

## 3. Anti-patterns and code smells

| Issue | Why it matters | Fix |
|---|---|---|
| `key={index}` | The list is filtered and sorted, so indices move between renders. React then reuses the wrong row instances (stale state, broken animations, extra DOM updates). | Use a stable key: `` `${blockchain}:${currency}` `` |
| `blockchain: any` | Turns off type checking; typos like `'Etherum'` silently fall into `default`. | Use a `Blockchain` union type and a `Record<Blockchain, number>` map |
| Empty `interface Props extends BoxProps {}` | Adds no information (`@typescript-eslint/no-empty-interface` / `no-empty-object-type`). | `type WalletPageProps = BoxProps` |
| `React.FC<Props> = (props: Props)` | Declares the props type twice. `React.FC` adds nothing here. | A plain function with typed props |
| `children` destructured but never rendered | Whatever the parent passes as children is silently dropped. | Render `{children}` (or don't destructure it) |
| `FormattedWalletBalance` duplicates `WalletBalance` fields | Two definitions that can drift apart. | `interface FormattedWalletBalance extends WalletBalance` |
| Magic number `-99` repeated | The meaning ("unknown chain") is implicit and duplicated. | A named constant `UNKNOWN_PRIORITY` |
| `classes`, `useWalletBalances`, `usePrices`, `WalletRow` are never imported | The snippet is not self-contained (assumed to come from the surrounding codebase). | Import them explicitly (they are `declare`d in `index.tsx` so it type-checks on its own) |

---

## 4. Refactored version

See [`index.tsx`](./index.tsx). The core of it:

```tsx
const BLOCKCHAIN_PRIORITY: Readonly<Record<Blockchain, number>> = {
  Osmosis: 100, Ethereum: 50, Arbitrum: 30, Zilliqa: 20, Neo: 20,
};
const UNKNOWN_PRIORITY = -99;
const getPriority = (blockchain: string) =>
  BLOCKCHAIN_PRIORITY[blockchain as Blockchain] ?? UNKNOWN_PRIORITY;

export const WalletPage = ({ children, ...rest }: WalletPageProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Re-runs only when balances change, not on every price tick.
  const sortedBalances = useMemo(
    () =>
      balances
        .map((balance) => ({ balance, priority: getPriority(balance.blockchain) }))
        .filter(({ balance, priority }) => priority > UNKNOWN_PRIORITY && balance.amount > 0)
        .sort((a, b) => b.priority - a.priority || b.balance.amount - a.balance.amount)
        .map(({ balance }) => balance),
    [balances],
  );

  const formattedBalances = useMemo<FormattedWalletBalance[]>(
    () =>
      sortedBalances.map((balance) => ({
        ...balance,
        formatted: amountFormatter.format(balance.amount),
        usdValue: (prices[balance.currency] ?? 0) * balance.amount,
      })),
    [sortedBalances, prices],
  );

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}:${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
      {children}
    </div>
  );
};
```

### Summary of changes

| # | Before | After |
|---|---|---|
| 1 | Crash / compile error (`lhsPriority`, missing `blockchain`) | Compiles under `strict` |
| 2 | Shows only empty balances | Shows known chains with `amount > 0` |
| 3 | `formatted` is always `undefined` | Formatted with `Intl.NumberFormat` |
| 4 | Comparator returns `undefined` on ties | Deterministic: priority desc, then amount desc |
| 5 | Re-sorts on every price change | Re-sorts only when balances change |
| 6 | `getPriority` called O(n log n) times, re-created each render | O(n) calls, module scope, constant map |
| 7 | `key={index}`, `any`, empty interface, dropped `children` | Stable key, union type, type alias, children rendered |
| 8 | `NaN` USD values for unpriced tokens | Falls back to `0` |
