import "../styles/globals.css";

export default function HomePage() {
  return (
    <div className="text-center p-6">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6">
        <h1 className="text-5xl font-bold text-blue-400 mb-4">Bienvenido a GSquared Bank</h1>
        <p className="text-lg text-gray-300 max-w-xl">
          Banca digital segura, rápida y confiable para todas tus necesidades financieras.
        </p>
        <div className="mt-6">
          <a href="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md">
            Iniciar Sesión
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-900">
        <h2 className="text-4xl font-bold text-blue-400 mb-6">Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-300">Pagos Instantáneos</h3>
            <p className="text-gray-400 mt-2">Realiza y recibe pagos al instante.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-300">Seguridad Avanzada</h3>
            <p className="text-gray-400 mt-2">Protección con encriptación de nivel bancario.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-300">Historial Completo</h3>
            <p className="text-gray-400 mt-2">Consulta todas tus transacciones fácilmente.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-800">
        <h2 className="text-4xl font-bold text-blue-400 mb-6">¿Necesitas ayuda?</h2>
        <p className="text-gray-400 mb-4">Contáctanos para resolver tus dudas.</p>
        <a href="mailto:soporte@gsquaredbank.com" className="text-blue-300 hover:underline">
          soporte@gsquaredbank.com
        </a>
      </section>
    </div>
  );
}
