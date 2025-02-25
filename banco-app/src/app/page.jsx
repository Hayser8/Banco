"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../components/Card.jsx"
import { FiUpload, FiBarChart2, FiDatabase, FiUser, FiTrendingUp } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HomePage() {
  const [adminName, setAdminName] = useState("Administrador");

  // Simulación de datos financieros
  const data = [
    { name: "Lun", ingresos: 4000 },
    { name: "Mar", ingresos: 3000 },
    { name: "Mié", ingresos: 5000 },
    { name: "Jue", ingresos: 7000 },
    { name: "Vie", ingresos: 6000 },
    { name: "Sáb", ingresos: 2000 },
    { name: "Dom", ingresos: 8000 },
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      {/* Encabezado */}
      <h1 className="text-4xl font-bold mb-2">Bienvenido, {adminName} 👋</h1>
      <p className="text-textSecondary mb-6">Administra las transacciones y analiza los datos con facilidad.</p>

      {/* Sección de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total de Transacciones" value="8,542" icon={<FiDatabase size={24} />} />
        <StatCard title="Nuevos Usuarios" value="1,245" icon={<FiUser size={24} />} />
        <StatCard title="Ingresos Semanales" value="$45,320" icon={<FiTrendingUp size={24} />} />
      </div>

      {/* Sección de acceso rápido */}
      <h2 className="text-2xl font-semibold mb-4">Accesos Rápidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Dashboard" description="Visualiza métricas clave y reportes" link="/dashboard" />
        <Card title="Subir CSV" description="Carga archivos con datos" link="/subir-csv" />
        <Card title="Historial" description="Consulta transacciones pasadas" link="/historial" />
        <Card title="Data Insights" description="Analiza patrones financieros" link="/datascience" />
        <Card title="Perfil" description="Gestiona tu cuenta" link="/perfil" />
      </div>

      {/* Sección de gráfico financiero */}
      <h2 className="text-2xl font-semibold mb-4">Resumen Financiero</h2>
      <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Line type="monotone" dataKey="ingresos" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Componente para mostrar estadísticas rápidas */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

