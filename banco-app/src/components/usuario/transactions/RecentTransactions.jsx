"use client";

import { FiClock } from "react-icons/fi";

const transactions = [
  { id: "TXN001", fecha: "2024-02-24", monto: 150.00, destinatario: "Juan Pérez" },
  { id: "TXN002", fecha: "2024-02-23", monto: 85.75, destinatario: "Ana López" },
  { id: "TXN003", fecha: "2024-02-22", monto: 200.00, destinatario: "Carlos Martínez" },
];

export default function RecentTransactions() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Transacciones Recientes</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div>
              <p className="text-white font-semibold">{txn.destinatario}</p>
              <p className="text-gray-400 text-sm">{txn.fecha}</p>
            </div>
            <div className="text-green-400 font-bold">${txn.monto.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
