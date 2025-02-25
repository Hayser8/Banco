"use client";

import { useState } from "react";

export default function SecuritySettings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    alert("Contraseña actualizada correctamente.");
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor mb-6">
      <h3 className="text-xl font-semibold mb-4">Seguridad de la Cuenta 🔒</h3>
      <form className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-card p-2 rounded-md border border-borderColor text-textPrimary"
          placeholder="Nueva Contraseña"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-card p-2 rounded-md border border-borderColor text-textPrimary"
          placeholder="Confirmar Contraseña"
        />

        <button
          type="button"
          onClick={handleChangePassword}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
}
