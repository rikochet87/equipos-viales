import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vialidad: {
          azul: "#1e3a5f",
          celeste: "#2980b9",
          amarillo: "#FFE400",
          naranja: "#f39c12",
          verde: "#27ae60",
          rojo: "#e74c3c",
          gris: "#ecf0f1",
          oscuro: "#333333",
        },
      },
    },
  },
  plugins: [],
};

export default config;
