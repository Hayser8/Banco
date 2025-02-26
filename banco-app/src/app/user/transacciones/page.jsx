"use client";

import { useState } from "react";
import TransactionsForm from "../../../components/usuario/transactions/TransactionsForm.jsx";
import TransactionStatus from "../../../components/usuario/transactions/TransactionStatus.jsx";
import RecentTransactions from "../../../components/usuario/transactions/RecentTransactions.jsx";

export default function Transacciones() {
  const [transactionStatus, setTransactionStatus] = useState(null);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4 text-white">Realizar una Transacción 💸</h1>
      <p className="text-gray-400 mb-6">Envía dinero de manera rápida, segura y confiable.</p>

      {/* Formulario de transacción */}
      <TransactionsForm setTransactionStatus={setTransactionStatus} />

      {/* Estado de la transacción con animación */}
      {transactionStatus && <TransactionStatus status={transactionStatus} />}

      {/* Historial de transacciones recientes */}
      <RecentTransactions />
    </div>
  );
}
