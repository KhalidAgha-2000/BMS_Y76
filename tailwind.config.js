/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'floating-shadow': '0px 26px 27px 0px #e04e17',
      },
    },
  },
  plugins: [],
}