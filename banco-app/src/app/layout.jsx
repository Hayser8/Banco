import Navbar from "../components/Navbar";
import "./styles/globals.css";  // Asegura que esta línea sea correcta

export const metadata = {
  title: "BancoApp - Plataforma de Transacciones",
  description: "Gestiona tus transacciones con un diseño moderno y seguro.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-textPrimary">
        <Navbar />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
