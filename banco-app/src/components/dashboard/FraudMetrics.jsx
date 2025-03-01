import { FiAlertTriangle, FiShield, FiBarChart2 } from "react-icons/fi";
import StatCard from "./StatCard";

export default function FraudMetrics({ data }) {
  const activeAlerts = data ? data.active_fraud_alerts : 0;
  const fraudConfirmed =
    data && data.fraud_confirmed !== undefined ? data.fraud_confirmed : 0;
  const fraudPercentage =
    data && data.fraud_percentage !== undefined
      ? data.fraud_percentage
      : activeAlerts > 0
      ? ((fraudConfirmed / activeAlerts) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Alertas de Fraude"
        value={activeAlerts.toString()}
        icon={<FiAlertTriangle size={24} className="text-red-500" />}
      />
      <StatCard
        title="Fraudes Confirmados"
        value={fraudConfirmed.toString()}
        icon={<FiShield size={24} className="text-yellow-500" />}
      />
      <StatCard
        title="% de Fraude Detectado"
        value={`${fraudPercentage}%`}
        icon={<FiBarChart2 size={24} className="text-green-400" />}
      />
    </div>
  );
}
