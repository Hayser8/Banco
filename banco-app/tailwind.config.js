/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", // Permite UI oscura
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // Azul oscuro
        card: "#1E293B", // Gris oscuro para tarjetas
        primary: "#3B82F6", // Azul brillante para botones
        textPrimary: "#E2E8F0", // Texto claro
        textSecondary: "#94A3B8" // Texto atenuado
      },
    },
  },
  plugins: [],
};
