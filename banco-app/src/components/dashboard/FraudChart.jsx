"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function FraudChart({ selectedPeriod }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mapear el selectedPeriod a un número de días
    let days;
    if (selectedPeriod === "Últimos 7 días") {
      days = 7;
    } else if (selectedPeriod === "Últimos 30 días") {
      days = 30;
    } else if (selectedPeriod === "Últimos 6 meses") {
      days = 180;
    } else {
      days = 7; 
    }

    fetch(`http://localhost:8080/fraud_chart?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data.fraud_chart || []);
      })
      .catch((err) => console.error("Error al cargar fraud_chart:", err));
  }, [selectedPeriod]);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
