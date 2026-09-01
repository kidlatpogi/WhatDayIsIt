/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#1a1a2e",
        accentPrimary: "#5f72e4",
        accentSecondary: "#8c9eff"
      },
      fontFamily: {
        'home-video': ['"Home Video"', 'sans-serif'],
        'led-dot-matrix': ['"LED Dot-Matrix"', 'sans-serif']
      }
    }
  },
  plugins: []
};
