"use client";

import { useState } from "react";

export default function TransactionsFilters({ transactions, setFilteredTransactions }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState("");

  const applyFilters = () => {
    let filtered = transactions;

    if (selectedStatus) {
      filtered = filtered.filter((txn) => txn.estado === selectedStatus);
    }

    if (dateRange) {
      const today = new Date();
      let filterDate = new Date(today);
      
      if (dateRange === "Últimos 7 días") filterDate.setDate(today.getDate() - 7);
      if (dateRange === "Últimos 30 días") filterDate.setDate(today.getDate() - 30);

      filtered = filtered.filter((txn) => new Date(txn.fecha) >= filterDate);
    }

    setFilteredTransactions(filtered);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-borderColor mb-6 flex gap-4">
      {/* Filtro por Estado */}
      <select
        className="bg-card text-textPrimary p-2 rounded-md"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="Completada">Completada</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Fraudulenta">Fraudulenta</option>
      </select>

      {/* Filtro por Fecha */}
      <select
        className="bg-card text-textPrimary p-2 rounded-md"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="">Todo el tiempo</option>
        <option value="Últimos 7 días">Últimos 7 días</option>
        <option value="Últimos 30 días">Últimos 30 días</option>
      </select>

      {/* Botón Aplicar */}
      <button onClick={applyFilters} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Aplicar Filtros
      </button>
    </div>
  );
}
