import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: '#e2e8f0',
        primary: {
          DEFAULT: '#1a365d',
          light: '#2c5282',
          dark: '#1a202c',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#d69e2e',
          light: '#ecc94b',
          dark: '#b7791f',
          foreground: '#ffffff',
        },
        'text-primary': '#2d3748',
        'text-secondary': '#4a5568',
        'text-muted': '#718096',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f7fafc',
        'border-light': '#e2e8f0',
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1a365d',
        },
        gold: {
          50: '#fffff0',
          100: '#fefcbf',
          200: '#faf089',
          300: '#f6e05e',
          400: '#ecc94b',
          500: '#d69e2e',
          600: '#b7791f',
          700: '#975a16',
          800: '#744210',
          900: '#5f370e',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Source Sans Pro', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
