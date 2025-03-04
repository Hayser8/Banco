import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function FraudTimeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/data_insights/fraud_day");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error al obtener fraudes por día:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados por Día de la Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="fraudes" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
