"use client";

import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiUserX } from "react-icons/fi";

export default function TransactionStatus({ status }) {
  const messages = {
    success: { text: "¡Transacción exitosa! ✅", color: "bg-green-500", icon: <FiCheckCircle size={30} className="text-white" /> },
    error: { text: "Error en la transacción ❌", color: "bg-red-500", icon: <FiXCircle size={30} className="text-white" /> },
    "insufficient-funds": { text: "Saldo insuficiente ❌", color: "bg-yellow-500", icon: <FiAlertTriangle size={30} className="text-white" /> },
    "account-not-found": { text: "Cuenta no encontrada ❌", color: "bg-gray-500", icon: <FiUserX size={30} className="text-white" /> },
  };

  return (
    <div className={`mt-6 p-4 rounded-lg text-center ${messages[status]?.color || "bg-gray-700"}`}>
      {messages[status]?.icon || <FiXCircle size={30} className="text-white" />}
      <p className="text-white font-semibold">{messages[status]?.text || "Error desconocido"}</p>
    </div>
  );
}
