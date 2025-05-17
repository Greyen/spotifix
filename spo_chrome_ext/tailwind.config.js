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
      backgroundColor:{
        offsetPlus:"rgba(232,232,227)"
      },
      colors: {
        textMain:"#13343B",
        borderMain: "rgba(215, 215, 206)",  /* Example value */
        background:  "rgba(252,252,249)",
        textOff:"rgba(100,100,95)",
        superDuper:"rgba(31,184,205)",
      },
      width: {
        28: "7rem", // Explicitly define 28 as 7rem
      },
      height: {
        8:"2rem",
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

