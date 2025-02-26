"use client";

import { useState } from "react";
import TransactionsTable from "../../../components/history/TransactionsTable";
import TransactionsFilters from "../../../components/history/TransactionsFilters";
import SearchBar from "../../../components/history/SearchBar";

// Datos simulados
const transactionsData = [
  { id: "TXN001", cliente: "Juan Pérez", fecha: "2024-02-20", monto: 500.00, estado: "Completada" },
  { id: "TXN002", cliente: "Ana Gómez", fecha: "2024-02-19", monto: 1200.50, estado: "Pendiente" },
  { id: "TXN003", cliente: "Carlos López", fecha: "2024-02-18", monto: 750.75, estado: "Fraudulenta" },
  { id: "TXN004", cliente: "María Rodríguez", fecha: "2024-02-17", monto: 300.20, estado: "Completada" },
];

export default function Historial() {
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Historial de Transacciones 📜</h1>
      <p className="text-textSecondary mb-6">
        Consulta, filtra y analiza las transacciones realizadas.
      </p>

      {/* Filtros */}
      <TransactionsFilters transactions={transactionsData} setFilteredTransactions={setFilteredTransactions} />

      {/* Barra de Búsqueda */}
      <SearchBar setSearchQuery={setSearchQuery} />

      {/* Tabla de Transacciones */}
      <TransactionsTable transactions={filteredTransactions} searchQuery={searchQuery} />
    </div>
  );
}
