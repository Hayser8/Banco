"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    nombre: "Admin Principal",
    email: "admin@bancoapp.com",
    rol: "Administrador",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor mb-6">
      <h3 className="text-xl font-semibold mb-4">Información Personal</h3>
      <form className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={profile.nombre}
          onChange={handleChange}
          className="w-full bg-card p-2 rounded-md border border-borderColor text-textPrimary"
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

        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
