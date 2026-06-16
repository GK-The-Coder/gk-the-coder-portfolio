/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Midnight Neon palette
        background: '#050816',
        card: '#0B1220',
        primary: '#7C3AED', // electric violet
        secondary: '#06B6D4', // cyan
        highlight: '#FF6B35', // hot orange
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "gradient-text": "gradient-text 3s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-text": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};