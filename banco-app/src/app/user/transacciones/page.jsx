"use client";

import { useState, useEffect } from "react";
import TransactionsForm from "../../../components/usuario/transactions/TransactionsForm.jsx";
import TransactionStatus from "../../../components/usuario/transactions/TransactionStatus.jsx";
import RecentTransactions from "../../../components/usuario/transactions/RecentTransactions.jsx";

export default function Transacciones() {
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [saldoDisponible, setSaldoDisponible] = useState(1000.00); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    async function fetchSaldo() {
      try {
        const response = await fetch(
          `http://localhost:8080/user/details?nombre=${encodeURIComponent(currentUser)}`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setSaldoDisponible(data?.account?.saldo_actual ?? 0);
      } catch (err) {
        console.error("Error al obtener el saldo del usuario:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSaldo();
  }, [currentUser]);

  if (loading) {
    return <div className="p-4">Cargando saldo...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4 text-white">Realizar una Transacción 💸</h1>
      <p className="text-gray-400 mb-6">Envía dinero de manera rápida, segura y confiable.</p>

      {/* Mostrar saldo disponible */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white font-semibold text-center mb-6">
        Saldo Disponible: <span className="text-green-400">${saldoDisponible.toFixed(2)}</span>
      </div>

      {/* Formulario de transacción */}
      <TransactionsForm 
        setTransactionStatus={setTransactionStatus} 
        saldoDisponible={saldoDisponible} 
        setSaldoDisponible={setSaldoDisponible} 
      />

      {/* Estado de la transacción con animación */}
      {transactionStatus && <TransactionStatus status={transactionStatus} />}

      {/* Historial de transacciones recientes */}
      <RecentTransactions />
    </div>
  );
}
