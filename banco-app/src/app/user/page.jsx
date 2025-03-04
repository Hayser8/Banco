"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiClock } from "react-icons/fi";

export default function UsuarioHome() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Leer el usuario actual desde el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario"); // Cambio aquí
    if (storedUser) {
      setCurrentUser(storedUser); // Ya es un string, no necesita JSON.parse
    }
  }, []);

  // Cuando se tiene el usuario, se hace fetch al backend para obtener su información
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    async function fetchUserData() {
      try {
        const response = await fetch(
          `http://localhost:8080/user/details?nombre=${encodeURIComponent(currentUser)}`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        // Se actualiza el saldo y la última transacción
        setAccountBalance(data?.account?.saldo_actual ?? 0);

        if (data?.lastTransaction) {
          setLastTransaction({
            id: data.lastTransaction.id_transaccion,
            fecha: data.lastTransaction.fecha_hora,
            monto: data.lastTransaction.monto,
            estado: data.lastTransaction.estado,
          });
        } else {
          setLastTransaction(null);
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-400">Error: {error}</div>;
  }

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
          value={
            lastTransaction
              ? `$${parseFloat(lastTransaction.monto).toFixed(2)}`
              : "$0.00"
          }
          icon={<FiClock size={24} />}
          extraInfo={
            lastTransaction
              ? `ID: ${lastTransaction.id} - ${lastTransaction.estado}`
              : "No hay transacciones registradas"
          }
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
