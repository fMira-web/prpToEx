// Tailwind CSS build-pipeline config (migrated off the cdn.tailwindcss.com
// runtime-JIT script — see BUILD.md for the full rationale and pipeline).
// This is the same theme extension that used to live inline in
// template.html's `<script>tailwind.config = {...}</script>` block; moving
// it here is what lets the CLI compile a static, purged, minified stylesheet
// ahead of time instead of shipping the whole Tailwind engine to the browser.
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Both template.html (static markup) and app.js (which builds a lot of
  // markup at runtime via string concatenation) are scanned as plain text —
  // Tailwind's JIT scanner looks for literal class-name substrings, so any
  // utility class app.js assembles from full literal strings (as this
  // codebase does throughout — e.g. array-indexed color lookups) is picked
  // up correctly even though it's never present as static HTML here.
  content: ['./template.html', './app.js'],
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
