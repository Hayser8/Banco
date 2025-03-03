"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiHome,
  FiDatabase,
  FiBarChart2,
  FiUser,
  FiAlertCircle,
  FiBell
} from "react-icons/fi";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const loadCount = () => {
      fetch("http://localhost:8080/notifications/today/count")
        .then(r => r.json())
        .then(data => setTodayCount(data.count))
        .catch(err => console.error(err));
    };
    loadCount();
    const intervalId = setInterval(loadCount, 15000);
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-card shadow-lg transition-all ${
        isOpen ? "w-64" : "w-20"
      } p-6`}
    >
      <button
        className="absolute top-6 -right-4 bg-card text-textSecondary hover:text-white transition transform rounded-full p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
      </button>

      <h2
        className={`text-xl font-bold text-white mb-6 transition ${
          isOpen ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        Admin Panel
      </h2>

      <nav className="space-y-4 mt-10">
        <NavItem href="/" icon={<FiHome size={20} />} label="Inicio" isOpen={isOpen} />
        <NavItem href="/admin/dashboard" icon={<FiBarChart2 size={20} />} label="Dashboard" isOpen={isOpen} />
        <NavItem href="/admin/subir-csv" icon={<FiUpload size={20} />} label="Subir CSV" isOpen={isOpen} />
        <NavItem href="/admin/historial" icon={<FiDatabase size={20} />} label="Historial" isOpen={isOpen} />
        <NavItem href="/admin/data-insights" icon={<FiBarChart2 size={20} />} label="Data Insights" isOpen={isOpen} />
        <NavItem href="/admin/alerts" icon={<FiAlertCircle size={20} />} label="Alertas" isOpen={isOpen} />
        
        <NavItem
          href="/admin/notificaciones"
          icon={
            <div className="relative">
              <FiBell size={20} />
              {todayCount > 0 && (
                <span className="bg-red-500 rounded-full w-3 h-3 absolute top-0 right-0" />
              )}
            </div>
          }
          label="Notificaciones"
          isOpen={isOpen}
        />
        
        <NavItem href="/admin/perfil" icon={<FiUser size={20} />} label="Perfil" isOpen={isOpen} />
      </nav>
    </aside>
  );
}

function NavItem({ href, icon, label, isOpen }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-textSecondary hover:text-white transition">
      {icon}
      <span className={`transition ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>{label}</span>
    </Link>
  );
}
