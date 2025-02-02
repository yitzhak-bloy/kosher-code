module.exports = {
  theme: {
    extend: {
      colors: {
        custom: {
          brand: "var(--brand)",
          "bg-primary": "var(--bg-primary)",
          "bg-card": "var(--bg-card)",
          "bg-card-2": "var(--bg-card-2)",
          "bg-header": "var(--bg-header)",
          "text-primary": "var(--text-primary)",
          "text-secondary": "var(--text-secondary)",
          "text-3": "var(--text-3)",
          "green-1": "var(--green-1)",
          "yellow-1": "var(--yellow-1)"
        }
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem"
      },
      boxShadow: {
        xxl: "0 25px 55px rgba(0,0,0,.2),0 16px 28px rgba(0,0,0,.24)"
      },

      fontFamily: {
        rubik: ["Rubik", "Roboto", "sans-serif"],
        tomorow: "Tomorrow"
      }
    }
  },
  variants: {},
  plugins: []
};
