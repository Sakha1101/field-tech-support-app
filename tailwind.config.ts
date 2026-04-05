import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f766e",
          dark: "#115e59",
          soft: "#ccfbf1",
        },
        ink: "#0f172a",
        panel: "#f8fafc",
        line: "#dbe4ee",
        warn: "#b45309",
        danger: "#b91c1c",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
