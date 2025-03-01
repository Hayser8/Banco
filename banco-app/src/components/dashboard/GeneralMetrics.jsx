import { FiUser, FiDatabase, FiDollarSign } from "react-icons/fi";
import StatCard from "./StatCard";

export default function GeneralMetrics({ data }) {
  const totalTransacciones = data ? data.total_transacciones : 0;
  const totalClientes = data ? data.total_clientes : 0;
  const totalCuentas = data ? data.total_cuentas : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Transacciones Totales"
        value={totalTransacciones.toLocaleString()}
        icon={<FiDollarSign size={24} />}
      />
      <StatCard
        title="Usuarios Registrados"
        value={totalClientes.toLocaleString()}
        icon={<FiUser size={24} />}
      />
      <StatCard
        title="Cuentas Registradas"
        value={totalCuentas.toLocaleString()}
        icon={<FiDatabase size={24} />}
      />
    </div>
  );
}
