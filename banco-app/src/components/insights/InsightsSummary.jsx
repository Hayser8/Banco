import { FiShield, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";

export default function InsightsSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard title="Usuarios con Alto Riesgo" value="42" icon={<FiShield size={24} className="text-yellow-500" />} />
      <StatCard title="Fraudes Detectados Este Mes" value="128" icon={<FiAlertTriangle size={24} className="text-red-500" />} />
      <StatCard title="Riesgo Promedio por Usuario" value="65%" icon={<FiTrendingUp size={24} className="text-green-400" />} />
    </div>
  );
}

/* Componente de Tarjetas de Métricas */
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
