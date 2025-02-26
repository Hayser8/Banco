"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const transactionsData = [
  { id: "TXN001", fecha: "2024-02-20", monto: 200.00, estado: "Completada" },
  { id: "TXN002", fecha: "2024-02-21", monto: 50.00, estado: "Pendiente" },
  { id: "TXN003", fecha: "2024-02-22", monto: 120.00, estado: "Rechazada" },
  { id: "TXN004", fecha: "2024-02-23", monto: 500.00, estado: "Completada" },
];

export default function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactionsData.filter((txn) =>
    (txn.id.includes(search) || txn.fecha.includes(search)) &&
    (statusFilter === "all" || txn.estado === statusFilter)
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">Historial de Transacciones 📜</h3>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Búsqueda */}
        <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900 flex-grow">
          <FiSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-white"
            placeholder="Buscar por ID o fecha..."
          />
        </div>

        {/* Filtro de Estado */}
        <div className="flex items-center border border-gray-600 rounded-md p-3 bg-gray-900">
          <FiFilter className="text-gray-400 mr-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-white"
          >
            <option value="all">Todos</option>
            <option value="Completada">Completadas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Monto</th>
              <th className="py-3 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} className="border-b border-gray-700">
                <td className="py-3 px-4">{txn.id}</td>
                <td className="py-3 px-4">{txn.fecha}</td>
                <td className="py-3 px-4 text-blue-400">${txn.monto.toFixed(2)}</td>
                <td className="py-3 px-4">
                  {txn.estado === "Completada" ? (
                    <span className="text-green-400 flex items-center">
                      <FiCheckCircle className="mr-2" /> Completada
                    </span>
                  ) : txn.estado === "Pendiente" ? (
                    <span className="text-yellow-400 flex items-center">
                      <FiClock className="mr-2" /> Pendiente
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center">
                      <FiXCircle className="mr-2" /> Rechazada
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
