"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";

export default function ProfileCard() {
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

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor flex items-center gap-6">
      <div className="relative w-20 h-20">
        <Image
          src="/naruto.webp"
          alt="Foto de Perfil"
          fill
          className="rounded-full border-2 border-primary"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          {profile.nombre || "Cargando..."}
        </h2>
        <p className="text-textSecondary">
          {profile.email || "Cargando..."}
        </p>
        <span className="text-green-400 text-sm">
          {profile.rol || "Cargando..."}
        </span>
      </div>
    </div>
  );
}
