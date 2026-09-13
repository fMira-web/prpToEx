// Same theme extension as the old static-site build's tailwind.config.js —
// migrated here so Next.js's own PostCSS pipeline compiles the utilities
// (via `@tailwind` directives in app/globals.css) instead of the old
// standalone Tailwind CLI step. No cdn.tailwindcss.com runtime script either way.
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Everything that can contain a Tailwind utility class name, scanned as
  // plain text. Tailwind's JIT scanner looks for literal class-name
  // substrings in the raw file text regardless of language/syntax, so a
  // class name assembled from a full literal string inside a ternary or
  // array (e.g. the per-skill color maps in components/FilterChips.tsx) is
  // picked up correctly as long as the whole class name appears literally
  // somewhere in the source — same requirement the legacy app.js's
  // string-concatenated markup relied on, just now inside .tsx files.
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        base: {
          bg: '#0B0F19',
          panel: '#10151f',
          card: '#131a27',
          line: '#232b3d',
        },
        brand: {
          emerald: '#34d399',
          indigo: '#818cf8',
          amber: '#fbbf24',
          rose: '#fb7185',
          sky: '#38bdf8',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(129,140,248,0.25), 0 8px 30px -8px rgba(129,140,248,0.35)',
        glowEmerald: '0 0 0 1px rgba(52,211,153,0.3), 0 8px 30px -8px rgba(52,211,153,0.4)',
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.6)',
      },
      keyframes: {
        floatSlow: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow: { '0%,100%': { opacity: 0.55 }, '50%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 3.2s linear infinite',
      },
    },
  },
  plugins: [],
};
