/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  theme: "light",
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2C5530",
          "primary-content": "#FFFFFF",
          secondary: "#8B4513",
          "secondary-content": "#FFFFFF",
          accent: "#FFD700",
          "accent-content": "#2C5530",
          neutral: "#708090",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F5F7F5",
          "base-300": "#90EE90",
          "base-content": "#2C5530",
          info: "#87CEEB",
          success: "#90EE90",
          warning: "#FFD700",
          error: "#FF6347",
          "--rounded-btn": "0.5rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      // {
      //   dark: {
      //     primary: "#90EE90",
      //     "primary-content": "#1A332D",
      //     secondary: "#8B4513",
      //     "secondary-content": "#FFFFFF",
      //     accent: "#FFD700",
      //     "accent-content": "#1A332D",
      //     neutral: "#708090",
      //     "neutral-content": "#F5F7F5",
      //     "base-100": "#1A332D",
      //     "base-200": "#2C5530",
      //     "base-300": "#3A6B3F",
      //     "base-content": "#F5F7F5",
      //     info: "#87CEEB",
      //     success: "#90EE90",
      //     warning: "#FFD700",
      //     error: "#FF6347",
      //     "--rounded-btn": "0.5rem",
      //     ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
      //     ".link": { textUnderlineOffset: "2px" },
      //     ".link:hover": { opacity: "80%" },
      //   },
      // },
    ],
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "forest-green": "#2C5530",
        "earth-brown": "#8B4513",
        "sunlight-yellow": "#FFD700",
        "leaf-green": "#90EE90",
        "sky-blue": "#87CEEB",
        "stone-gray": "#708090",
        "clean-white": "#FFFFFF",
        "deep-forest": "#1A332D",
      },
    },
  },
};
