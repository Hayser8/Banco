import "../styles/globals.css"

export default function LandingLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>GSquared Bank - Banca Digital</title>
        <meta name="description" content="La mejor experiencia bancaria digital, rápida, segura y eficiente." />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Navbar */}
        <header className="bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400">GSquared Bank</h1>
          <nav className="space-x-6">
            <a href="/login" className="hover:text-blue-300">Iniciar Sesión</a>
            <a href="/register" className="hover:text-blue-300">Registrarse</a>
          </nav>
        </header>

        {/* Contenido principal */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 py-4 text-center text-gray-400">
          © {new Date().getFullYear()} GSquared Bank - Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
