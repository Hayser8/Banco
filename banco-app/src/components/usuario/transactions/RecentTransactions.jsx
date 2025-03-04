"use client";

import { useState, useEffect } from "react";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Obtener usuario desde localStorage después de renderizar
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  // Obtener historial de transacciones
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        console.log("Fetching transactions for:", currentUser);

        const response = await fetch(
          `http://localhost:8080/user/transactions/full?nombre=${encodeURIComponent(currentUser)}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Transacciones recibidas:", data.transactions);

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error al obtener transacciones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [currentUser]);

  if (loading) return <div className="text-white">Cargando transacciones...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Transacciones Recientes</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        {transactions.length > 0 ? (
          transactions.map((txn) => (
            <div key={txn.id_transaccion} className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
              <div>
                <p className="text-white font-semibold">{txn.destinatario || "Cuenta sin titular"}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(txn.fecha_hora).toLocaleString()} - 
                  <span className="text-blue-400"> {txn.cuenta_destino} </span>
                </p>
              </div>
              <div className="text-green-400 font-bold">${parseFloat(txn.monto).toFixed(2)}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No hay transacciones recientes.</p>
        )}
      </div>
    </div>
  );
}
