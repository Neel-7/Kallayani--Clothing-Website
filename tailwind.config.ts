import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fff",
        soft: "#f5f5f3",
        ink: "#171412",
        muted: "#69635f",
        line: "#dedbd7",
        red: "#a82b24",
        wine: "#4a1116",
      },
      fontFamily: {
        display: ["Outfit", "Arial", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      spacing: { gutter: "clamp(16px,2vw,40px)" },
      screens: {
        compact: { max: "1150px" },
        tablet: { max: "900px" },
        phone: { max: "600px" },
        desktop: { min: "901px" },
      },
      keyframes: {
        menuIn: { from: { opacity: "0", transform: "translateY(-4px)" } },
        fadeIn: { from: { opacity: "0" } },
        sheetRight: { from: { transform: "translateX(100%)" } },
        sheetLeft: { from: { transform: "translateX(-100%)" } },
      },
      animation: {
        menuIn: "menuIn .16s ease",
        fadeIn: "fadeIn .18s",
        sheetRight: "sheetRight .25s",
        sheetLeft: "sheetLeft .25s",
      },
    },
  },
  plugins: [],
} satisfies Config;
