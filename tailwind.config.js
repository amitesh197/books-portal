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
        "navbar-dark": " #2e2c2d",
        "banner-btn": "#17115c",
        "theme-yellow-light": "rgb(253, 152, 25)",
      },
    },
  },
  plugins: [],
};
