/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
    },
    fontFamily: {
      sbaggrob: ["SBAggroB", "Noto Sans KR", "sans-serif"],
      sbaggrom: ["SBAggroM", "Noto Sans KR", "sans-serif"],
      sbaggrol: ["SBAggroL", "Noto Sans KR", "sans-serif"],
      recipekorea: ["Recipekorea", "Noto Sans KR", "sans-serif"],
    },
    fontSize: {
      xs: "0.625rem",
      sm: "0.75rem",
      base: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
