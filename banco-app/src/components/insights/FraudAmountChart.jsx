import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function FraudAmountChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/data_insights/fraud_amount");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error al obtener fraudes por monto:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Fraudes Detectados por Monto</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monto" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="fraudes" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
