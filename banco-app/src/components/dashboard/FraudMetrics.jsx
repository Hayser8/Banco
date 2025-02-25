import { FiAlertTriangle, FiShield, FiBarChart2 } from "react-icons/fi";
import StatCard from "./StatCard";

export default function FraudMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard title="Alertas de Fraude" value="52" icon={<FiAlertTriangle size={24} className="text-red-500" />} />
      <StatCard title="Fraudes Confirmados" value="18" icon={<FiShield size={24} className="text-yellow-500" />} />
      <StatCard title="% de Fraude Detectado" value="2.3%" icon={<FiBarChart2 size={24} className="text-green-400" />} />
    </div>
  );
}
