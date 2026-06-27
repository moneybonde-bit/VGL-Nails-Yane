import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — soft, premium, feminine
        cream: '#FBF8F6', // off-white background
        nude: {
          50: '#FAF3EF',
          100: '#F3E7E0', // soft nude
          200: '#E7D3C8',
          300: '#DCC0B3',
        },
        dusty: {
          // dusty pink
          200: '#EAC9C4',
          400: '#D9A8A0',
          500: '#C98B86',
        },
        rose: {
          // rose gold accent
          gold: '#B76E79',
          softgold: '#E8C4BD',
        },
        ash: {
          // abu muda (light gray)
          100: '#EFECEA',
          200: '#E5E0DD',
          300: '#CFC8C3',
        },
        ink: {
          DEFAULT: '#2B2422', // warm near-black text
          muted: '#8A7E78',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
        '4xl': '3rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(43, 36, 34, 0.04), 0 8px 24px rgba(43, 36, 34, 0.05)',
        'soft-lg': '0 6px 16px rgba(43, 36, 34, 0.06), 0 18px 48px rgba(43, 36, 34, 0.08)',
        glow: '0 8px 32px rgba(183, 110, 121, 0.18)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
