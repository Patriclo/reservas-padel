import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        padel: {
          green: "#2d6a4f",
          "green-light": "#40916c",
          "green-dark": "#1b4332",
          accent: "#74c69d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
