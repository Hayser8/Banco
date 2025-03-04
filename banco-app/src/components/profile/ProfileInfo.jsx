"use client";

import { useState, useEffect } from "react";

export default function ProfileInfo() {
  const [profile, setProfile] = useState({
    nombre: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return;

    fetch(`http://localhost:8080/perfil?nombre=${encodeURIComponent(usuario)}`)
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error("Error al obtener perfil:", error));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/perfil?nombre=${encodeURIComponent(profile.nombre)}&email=${encodeURIComponent(profile.email)}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await response.json();
      setProfile(data);
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Información Personal</h3>
      <form className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={profile.nombre}
          disabled
          className="w-full bg-gray-700 p-2 rounded-md border border-borderColor text-textPrimary"
          placeholder="Nombre"
        />

        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full bg-card p-2 rounded-md border border-borderColor text-textPrimary"
          placeholder="Correo Electrónico"
        />

        <input
          type="text"
          name="rol"
          value={profile.rol}
          disabled
          className="w-full bg-gray-700 p-2 rounded-md border border-borderColor text-textPrimary"
          placeholder="Rol"
        />

        <button
          type="button"
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
