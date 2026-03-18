import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0f1d",
        panel: "#0f1729",
        line: "#1e293b",
        accent: {
          cyan: "#4fd1c5",
          gold: "#f5c451",
          rose: "#ef7c8e"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(10, 15, 29, 0.45)"
      },
      backgroundImage: {
        arena:
          "radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(239, 124, 142, 0.14), transparent 30%), linear-gradient(180deg, #08101d 0%, #0a0f1d 100%)"
      }
    }
  },
  plugins: []
};

export default config;
