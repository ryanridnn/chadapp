import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "app-bg": {
          100: "#FAFCFF",
        },
        "app-grey": {
          100: "#F1F5FA",
          200: "#E9F1F9",
          300: "#E1ECF6",
          400: "#d4dde6",
          500: "#F3F6FB",
          600: "#E6EFF8",
          700: "#fafafa",
        },
        "app-theme": {
          "black-100": "#333333",
          "success-100": "#29D26D",
          "success-200": "#1EC05F",
          "danger-100": "#F85F5F",
          "orange-100": "#EF4444",
        },
        "app-text": {
          100: "#333",
          200: "#777777",
          300: "#888888",
          "disabled-100": "#B0B0B0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
