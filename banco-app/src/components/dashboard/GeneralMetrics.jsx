import { FiUser, FiDatabase, FiDollarSign } from "react-icons/fi";
import StatCard from "./StatCard";

export default function GeneralMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard title="Ingresos Totales" value="$120,500" icon={<FiDollarSign size={24} />} />
      <StatCard title="Usuarios Registrados" value="5,320" icon={<FiUser size={24} />} />
      <StatCard title="Transacciones Hoy" value="245" icon={<FiDatabase size={24} />} />
    </div>
  );
}
