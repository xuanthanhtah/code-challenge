import { useState } from 'react';

interface TokenIconProps {
  symbol: string;
  src: string;
  size?: number;
}

/** Hue derived from the symbol so fallback avatars are stable & colorful. */
const hueFromSymbol = (symbol: string) =>
  [...symbol].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 360, 7);

/** Token logo with a gradient monogram fallback when the SVG is missing. */
export const TokenIcon = ({ symbol, src, size = 28 }: TokenIconProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  if (hasError) {
    const hue = hueFromSymbol(symbol);
    return (
      <span
        className="token-icon token-icon--fallback"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.42,
          background: `linear-gradient(135deg, hsl(${hue} 80% 60%), hsl(${(hue + 50) % 360} 80% 45%))`,
        }}
        aria-hidden="true"
      >
        {symbol.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="token-icon"
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
};
