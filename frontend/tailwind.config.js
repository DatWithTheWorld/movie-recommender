module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1a202c",
        "dark-card": "#2d3748",
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        bounce: "bounce 1s infinite",
      },
      keyframes: {
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
