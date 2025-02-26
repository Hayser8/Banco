import UserSidebar from "../../components/usuario/UserSidebar";
import "../styles/globals.css"

export default function UsuarioLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white flex">
        {/* Sidebar de Usuario */}
        <UserSidebar />

        {/* Contenido Principal con margen para evitar que el sidebar lo tape */}
        <main className="flex-grow p-6 ml-64 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
