/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
      },
      fontWeight: {
        extrabolder: 700,
      },
      colors: {

        "theme-light-gray": "rgb(210, 210, 210)",
        "theme-dark-gray": "rgb(112, 112, 112)",
        "theme-yellow-dark": " #ffa812",
        "theme-yellow-light": "rgb(253, 152, 25)",
        "theme-dark": " #2e2c2d",
        "banner-btn": "#17115c",
        "theme-gray": "#D9D9D9",
        "theme-light-blue": "#F7FAFC",
        "theme-blue": "#009AE0",
      },
      scale: {
        35: "0.35",
        80: "0.8",
        85: "0.85",
        90: "0.9",
        95: "0.95",
      },
    },
  },
  plugins: [],
};
