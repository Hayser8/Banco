"use client";

import { useState } from "react";
import { FiUser, FiMail, FiLock, FiBell, FiMoon, FiGlobe, FiImage } from "react-icons/fi";

export default function UserProfile() {
  const [formData, setFormData] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    idioma: "es",
    notificaciones: true,
    modoOscuro: true,
    nuevaContrasena: "",
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado con éxito! 🚀");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">Perfil del Usuario 🏦</h3>

      {/* Imagen de Perfil */}
      <div className="flex justify-center mb-4">
        <label className="cursor-pointer relative">
          <input type="file" className="hidden" />
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700 transition">
            <FiImage size={30} className="text-gray-400" />
          </div>
        </label>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Nombre y Correo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
              placeholder="Nombre completo"
            />
          </div>

          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiMail className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
              placeholder="Correo electrónico"
            />
          </div>
        </div>

        {/* Seguridad */}
        <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
          <FiLock className="text-gray-400 mr-3" />
          <input
            type="password"
            name="nuevaContrasena"
            value={formData.nuevaContrasena}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none text-white"
            placeholder="Nueva Contraseña"
          />
        </div>

        {/* Configuraciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notificaciones */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="notificaciones"
              checked={formData.notificaciones}
              onChange={handleChange}
              className="hidden"
            />
            <div className={`w-10 h-5 flex items-center bg-gray-600 rounded-full p-1 transition ${formData.notificaciones ? "bg-blue-500" : ""}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${formData.notificaciones ? "translate-x-5" : ""}`}></div>
            </div>
            <span className="text-white flex items-center gap-2">
              <FiBell /> Notificaciones
            </span>
          </label>

          {/* Modo Oscuro */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="modoOscuro"
              checked={formData.modoOscuro}
              onChange={handleChange}
              className="hidden"
            />
            <div className={`w-10 h-5 flex items-center bg-gray-600 rounded-full p-1 transition ${formData.modoOscuro ? "bg-blue-500" : ""}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${formData.modoOscuro ? "translate-x-5" : ""}`}></div>
            </div>
            <span className="text-white flex items-center gap-2">
              <FiMoon /> Modo Oscuro
            </span>
          </label>

          {/* Idioma */}
          <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
            <FiGlobe className="text-gray-400 mr-3" />
            <select
              name="idioma"
              value={formData.idioma}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
            </select>
          </div>
        </div>

        {/* Botón Guardar */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2 mt-4">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
