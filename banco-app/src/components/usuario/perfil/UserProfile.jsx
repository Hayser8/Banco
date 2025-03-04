"use client";

import { useState, useEffect } from "react";
import { FiUser, FiMail } from "react-icons/fi";

export default function UserProfile() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Recupera el nombre del usuario desde localStorage (clave "usuario")
    const storedUsuario = localStorage.getItem("usuario");
    if (storedUsuario) {
      // Inicialmente seteamos el nombre desde localStorage
      setFormData((prev) => ({ ...prev, nombre: storedUsuario }));

      // Luego, hacemos una consulta al backend para obtener los datos completos (incluido el email)
      fetch(`http://localhost:8080/perfil?nombre=${encodeURIComponent(storedUsuario)}`)
        .then((response) => response.json())
        .then((data) => {
          // Se asume que la respuesta tiene las propiedades "nombre" y "email"
          setFormData({
            nombre: data.nombre || storedUsuario,
            email: data.email || "",
          });
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error("Error al obtener perfil:", error);
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Usamos el email obtenido (o se puede seguir usando "usuario" como identificador)
    if (!formData.email) {
      alert("No se encontró la información de la sesión.");
      return;
    }

    const payload = {
      current_email: formData.email,
      nombre: formData.nombre,
      email: formData.email,
    };

    try {
      const response = await fetch("http://localhost:8080/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("¡Perfil actualizado con éxito! 🚀");
        // Actualiza el localStorage si se cambió el nombre
        localStorage.setItem("usuario", formData.nombre);
        localStorage.setItem("userEmail", formData.email);
      } else {
        const errorData = await response.json();
        alert("Error al actualizar el perfil: " + errorData.detail);
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    }
  };

  if (!isLoaded) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">
        Perfil del Usuario 🏦
      </h3>

      {/* Imagen de Perfil con rocklee.jpg */}
      <div className="flex justify-center mb-4">
        <img
          src="/rocklee.jpg"
          alt="Rocklee"
          className="w-24 h-24 object-cover rounded-full border border-gray-600 hover:opacity-80 transition"
        />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Campos de Nombre y Correo */}
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

        {/* Botón para guardar cambios */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2 mt-4"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
