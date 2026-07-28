import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          600: "#2f6b3a",
          700: "#265a30",
          900: "#16321c",
        },
        gold: {
          500: "#d3a13c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
