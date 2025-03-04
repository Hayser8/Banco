import { useState, useEffect } from "react";
import { FiShield, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";

export default function InsightsSummary() {
  const [summary, setSummary] = useState({
    usuarios_alto_riesgo: 0,
    fraudes_este_mes: 0,
    riesgo_promedio: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/data_insights/insights_summary");
        const result = await response.json();
        setSummary(result);
      } catch (error) {
        console.error("Error al obtener resumen de datos:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard title="Usuarios con Alto Riesgo" value={summary.usuarios_alto_riesgo} icon={<FiShield size={24} className="text-yellow-500" />} />
      <StatCard title="Fraudes Detectados Este Mes" value={summary.fraudes_este_mes} icon={<FiAlertTriangle size={24} className="text-red-500" />} />
      <StatCard title="Riesgo Promedio por Usuario" value={`${summary.riesgo_promedio}%`} icon={<FiTrendingUp size={24} className="text-green-400" />} />
    </div>
  );
}

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
