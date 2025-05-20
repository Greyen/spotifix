import { Placeholder } from 'drizzle-orm';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",  /* ✅ This is what pb-md uses */
      lg: "24px",
      xl: "48px",
    },
    extend: {
      fontFamily:{
        sans: [ "var(--font-fk-grotesk-neue)","FKGroteskNeue", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", "Noto Sans", "sans-serif", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", ],
      },
      animation: {
        'wave-slow': 'wave 15s ease-in-out infinite alternate',
        'wave-slower': 'wave 20s ease-in-out infinite alternate-reverse',
        'pulse-slow': 'pulse 5s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(-25%)' },
          '100%': { transform: 'translateX(25%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundColor:{
        offsetPlus:"rgba(232,232,227)"
      },
      colors: {
        textMain:"#13343B",
        borderMain: "rgba(215, 215, 206)",  /* Example value */
        background:  "rgba(252,252,249)",
        textOff:"rgba(100,100,95)",
        superDuper:"rgba(31,184,205)",
        navy: {
          950: '#050e29',
          900: '#0a1740',
          800: '#0f2056',
          700: '#152a6e',
        },
        blue: {
          300: '#6FC2FF',
          400: '#42AAFF',
          500: '#0091FF',
        },
        cream: {
          100: '#F5F3EF',
        },
      },
      width: {
        28: "7rem", // Explicitly define 28 as 7rem
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
      },
      height: {
        8:"2rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",

      },
      transitionDuration: {
        '300': '300ms', // Ensures transition duration of 300ms
      },
      text:{
        textMain:"20px"
      },
      stroke: {
        textMain: '#13343B', // Defines stroke color for textMain
      },
      transitionProperty:{
        all:"all"
      },
      wordBreak: {
        'break-word': 'break-word',
      },
      minWidth: {
        '0': '0px',
      },
    },
  },
  plugins: [],
}

