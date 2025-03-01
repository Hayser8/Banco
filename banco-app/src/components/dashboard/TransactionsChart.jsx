"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function TransactionsChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item.fecha,         
    transacciones: item.total 
  }));

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Cantidad de Transacciones por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="transacciones" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
