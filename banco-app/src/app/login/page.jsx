"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para manejar la redirección en Next.js
import "../styles/globals.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Hook para redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim()) {
      setError("Por favor, ingresa tu nombre de usuario.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8080/login?nombre=${username}`);
      const data = await response.json();

      if (response.ok) {
        alert(`Bienvenido, ${username}! Redirigiendo...`);
        router.push(data.redirect_to); // Redirigir según el rol
      } else {
        setError(data.detail || "Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">Iniciar Sesión</h2>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-300 mb-1">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md font-semibold flex justify-center items-center gap-2
              ${loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}
            `}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
