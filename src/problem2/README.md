# Problem 2 – Fancy Form (Currency Swap)

A currency swap form built with **Vite + React + TypeScript**, styled with modern vanilla CSS (glassmorphism, aurora mesh background, dark/light themes, and bilingual support).

## Run

```bash
cd src/problem2
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # eslint check
```

## Features

- **Multi-language (EN / VI)**: Instant toggle between English and Tiếng Việt (🇬🇧 / 🇻🇳), with automatic browser language detection and `localStorage` persistence.
- **Theme toggle (Dark / Light)**: High-contrast Dark theme and crisp, elegant Light theme, with system preference detection (`prefers-color-scheme`) and `localStorage` persistence.
- **Live prices** from `https://interview.switcheo.com/prices.json` (de-duplicated: latest entry per token; tokens without a valid price are omitted), refreshed every 60s.
- **Token icons** from the Switcheo token-icons repo, with a gradient monogram fallback for missing SVGs.
- **Bidirectional input** – type in either "You pay" or "You receive"; the other side is computed from the exchange rate.
- **Token picker** – search, popular tokens, balances sorted by value, keyboard navigation (↑ ↓ Enter Esc). Picking the token on the opposite side flips the pair.
- **Flip button**, 25% / 50% / MAX shortcuts, invertible rate, expandable details (slippage, minimum received, network fee).
- **Validation** – input sanitizing (digits + one decimal separator, max 8 decimals, `,` → `.`), empty / zero amount, insufficient balance, amount too small. The submit button always explains what's missing in the selected language.
- **Mock backend** – wallet balances and swap submission are simulated (~2s delay, loading state, success screen with tx hash; balances update after a swap).
- **Resilience** – skeleton loader, `DataErrorBoundary` + `QueryErrorResetBoundary` with "Try again" when prices fail to load.
- Responsive (bottom-sheet modal on mobile), accessible labels/roles, `prefers-reduced-motion` support.

## Structure (Feature-Sliced Design)

```
src/
├── components/DataErrorBoundary.tsx   # shared error boundary
├── lib/queryClient.ts                 # React Query config (throwOnError, central logging)
├── features/
│   ├── theme/                         # Theme feature
│   │   ├── types/theme.types.ts
│   │   ├── contexts/                  # ThemeContext, ThemeProvider
│   │   ├── hooks/useTheme.ts
│   │   └── components/ThemeToggle.tsx # Sun/Moon toggle button
│   ├── i18n/                          # Internationalization feature
│   │   ├── types/i18n.types.ts
│   │   ├── locales/                   # en.ts, vi.ts
│   │   ├── contexts/                  # I18nContext, I18nProvider
│   │   ├── hooks/useTranslation.ts
│   │   └── components/LanguageToggle.tsx # EN/VI switcher
│   └── swap/                          # Core swap feature
│       ├── api/swap.api.ts            # network calls (real prices + mocked wallet/swap)
│       ├── types/swap.types.ts        # DTOs & domain types
│       ├── utils/swap.utils.ts        # pure helpers (normalize, convert, format, sanitize)
│       ├── hooks/                     # useTokenPrices, useWalletBalances, useSwapMutation, useSwapForm
│       ├── components/                # SwapWidget, SwapForm, TokenAmountField, TokenSelectModal, ...
│       └── pages/SwapPage.tsx
```
