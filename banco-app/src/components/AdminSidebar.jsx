"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiUpload, FiHome, FiDatabase, FiBarChart2, FiUser } from "react-icons/fi";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar abierto por defecto

  return (
    <aside className={`fixed top-0 left-0 h-full bg-card shadow-lg transition-all ${isOpen ? "w-64" : "w-20"} p-6`}>
      {/* Botón para colapsar/expandir */}
      <button
        className="absolute top-6 -right-4 bg-card text-textSecondary hover:text-white transition transform rounded-full p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
      </button>

      {/* Título */}
      <h2 className={`text-xl font-bold text-white mb-6 transition ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
        Admin Panel
      </h2>

      {/* Menú de navegación */}
      <nav className="space-y-4 mt-10">
        <NavItem href="/" icon={<FiHome size={20} />} label="Inicio" isOpen={isOpen} />
        <NavItem href="/admin/dashboard" icon={<FiBarChart2 size={20} />} label="Dashboard" isOpen={isOpen} />
        <NavItem href="/admin/subir-csv" icon={<FiUpload size={20} />} label="Subir CSV" isOpen={isOpen} />
        <NavItem href="/admin/historial" icon={<FiDatabase size={20} />} label="Historial" isOpen={isOpen} />
        <NavItem href="/admin/data-insights" icon={<FiBarChart2 size={20} />} label="Data Insights" isOpen={isOpen} />
        <NavItem href="/admin/perfil" icon={<FiUser size={20} />} label="Perfil" isOpen={isOpen} />
      </nav>
    </aside>
  );
}

// Componente reutilizable para cada ítem del menú
function NavItem({ href, icon, label, isOpen }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-textSecondary hover:text-white transition">
      {icon} <span className={`transition ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>{label}</span>
    </Link>
  );
}
