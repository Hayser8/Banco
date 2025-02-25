"use client";

import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";

export default function ProfileCard() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor flex items-center gap-6">
      {/* Imagen de Perfil */}
      <div className="relative">
        <Image
          src="/profile-placeholder.jpg" // Cambia esto por una imagen real
          alt="Foto de Perfil"
          width={80}
          height={80}
          className="rounded-full border-2 border-primary"
        />
        <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-md hover:bg-blue-600 transition">
          <FiEdit3 size={16} />
        </button>
      </div>

      {/* Información Básica */}
      <div>
        <h2 className="text-xl font-semibold">Admin Principal</h2>
        <p className="text-textSecondary">admin@bancoapp.com</p>
        <span className="text-green-400 text-sm">Administrador</span>
      </div>
    </div>
  );
}
