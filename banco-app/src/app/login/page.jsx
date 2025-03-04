"use client";

import { useState } from "react";
import "../styles/globals.css"

export default function LoginPage() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Por favor, ingresa tu nombre de usuario.");
      return;
    }
    alert(`Bienvenido, ${username}!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">Iniciar Sesión</h2>
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
