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
      colors: {
        "theme-yellow-dark": " #ff8e00",
        "theme-dark": " #2e2c2d",
        "banner-btn": "#17115c",
        "theme-yellow-light": "rgba(248, 168, 69, 0.71)",
        "theme-light-gray": "rgb(210, 210, 210)",
        "theme-dark-gray": "rgb(112, 112, 112)",
      },
    },
  },
  plugins: [],
};
