/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // Azul oscuro profundo
        card: "#1E293B", // Gris oscuro para tarjetas
        primary: "#3B82F6", // Azul para botones principales
        textPrimary: "#E2E8F0", // Texto claro
        textSecondary: "#94A3B8", // Texto atenuado
        borderColor: "#2D3748", // Bordes sutiles
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
