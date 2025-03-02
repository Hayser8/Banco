"use client";

import { useEffect, useState } from "react";
import TransactionsTable from "../../../components/history/TransactionsTable";
import TransactionsFilters from "../../../components/history/TransactionsFilters";
import SearchBar from "../../../components/history/SearchBar";

export default function Historial() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    fetch("http://localhost:8080/transacciones_busqueda") 
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transacciones);
        setFilteredTransactions(data.transacciones);
      })
      .catch((error) => console.error("Error al obtener transacciones:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Historial de Transacciones</h1>
      
      {/* Filtros (opcional, si quieres filtrar por estado o rango de fechas) */}
      <TransactionsFilters
        transactions={transactions}
        setFilteredTransactions={setFilteredTransactions}
      />

      {/* Barra de búsqueda */}
      <SearchBar setSearchQuery={setSearchQuery} />

      {/* Tabla de transacciones */}
      <TransactionsTable
        transactions={filteredTransactions}
        searchQuery={searchQuery}
      />
    </div>
  );
}
