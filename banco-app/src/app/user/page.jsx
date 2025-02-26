"use client";

import { useState } from "react";
import { FiDollarSign, FiTrendingUp, FiClock } from "react-icons/fi";

export default function UsuarioHome() {
  const [accountBalance, setAccountBalance] = useState(3500.75);
  const [lastTransaction, setLastTransaction] = useState({
    id: "TXN045",
    fecha: "2024-02-25",
    monto: 150.00,
    estado: "Completada",
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Resumen de Cuenta</h1>
      <p className="text-textSecondary mb-6">
        Aquí puedes ver un resumen rápido de tu cuenta y tu última transacción.
      </p>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard
          title="Saldo Disponible"
          value={`$${accountBalance.toFixed(2)}`}
          icon={<FiDollarSign size={24} />}
        />
        <SummaryCard
          title="Última Transacción"
          value={`$${lastTransaction.monto.toFixed(2)}`}
          icon={<FiClock size={24} />}
          extraInfo={`ID: ${lastTransaction.id} - ${lastTransaction.estado}`}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, extraInfo }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {extraInfo && <p className="text-textSecondary text-sm">{extraInfo}</p>}
      </div>
    </div>
  );
}
