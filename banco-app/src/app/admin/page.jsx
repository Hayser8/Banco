"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HomePage() {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/transacciones")
      .then(response => response.json())
      .then(data => {
        console.log("Datos recibidos:", data);
        setTransacciones(data.transacciones);
      })
      .catch(error => console.error("Error al obtener transacciones:", error));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-2">Bienvenido, Administrador 👋</h1>
      <p className="text-textSecondary mb-6">Administra las transacciones y analiza los datos con facilidad.</p>

      <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-2">Total de Transacciones</h2>
        <p className="text-2xl font-bold">{transacciones.length}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Últimas Transacciones</h2>
      <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transacciones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Line type="monotone" dataKey="monto" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
