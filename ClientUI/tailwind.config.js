/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust the paths according to your project structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "3/5": [3, 5], // custom aspect ratio
      },
      screens: {
        xxm: "300px",
        xs: "360px",
      },
    },
  },
  plugins: [],
};
