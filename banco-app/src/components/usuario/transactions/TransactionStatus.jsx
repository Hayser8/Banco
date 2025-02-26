"use client";

import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function TransactionStatus({ status }) {
  return (
    <div className={`mt-6 p-4 rounded-lg text-center transition-transform transform ${status === "success" ? "bg-green-500 scale-105" : "bg-red-500 scale-95"}`}>
      {status === "success" ? (
        <>
          <FiCheckCircle size={30} className="inline-block mb-2 text-white" />
          <p className="text-white font-semibold">¡Transacción exitosa! ✅</p>
        </>
      ) : (
        <>
          <FiXCircle size={30} className="inline-block mb-2 text-white" />
          <p className="text-white font-semibold">Error en la transacción ❌</p>
        </>
      )}
    </div>
  );
}
