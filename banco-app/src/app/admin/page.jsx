"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

export default function HomePage() {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/transacciones")
      .then(response => response.json())
      .then(data => {
        console.log("Datos recibidos:", data);
        const formattedData = data.transacciones_ultima_semana
          .map(tx => ({
            fecha: new Date(tx.fecha),
            monto: parseFloat(tx.monto),
          }))
          .sort((a, b) => a.fecha - b.fecha)  // 🔹 Ordenar las fechas por si acaso
          .map(tx => ({
            fecha: tx.fecha.toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            monto: tx.monto,
          }));
  
        setTransacciones(formattedData);
      })
      .catch(error => console.error("Error al obtener transacciones:", error));
  }, []);
  
  

  const maxMonto = Math.max(...transacciones.map(t => t.monto), 0);
  const minMonto = Math.min(...transacciones.map(t => t.monto), 0);
  const promedioMonto = (transacciones.reduce((sum, t) => sum + t.monto, 0) / transacciones.length) || 0;

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-2">Bienvenido, Administrador 👋</h1>
      <p className="text-textSecondary mb-6">Administra las transacciones y analiza los datos con facilidad.</p>

      <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-2">Transacciones en la Última Semana</h2>
        <p className="text-2xl font-bold">{transacciones.length}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Tendencia de Transacciones en la Última Semana</h2>
      <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={transacciones}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="fecha" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <ReferenceLine y={promedioMonto} stroke="orange" strokeDasharray="3 3" label="Promedio" />
            <Line type="monotone" dataKey="monto" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-400 mt-2">
          Monto máximo: <span className="text-green-400">${maxMonto.toFixed(2)}</span> | 
          Monto mínimo: <span className="text-red-400">${minMonto.toFixed(2)}</span> | 
          Promedio diario: <span className="text-yellow-400">${promedioMonto.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
