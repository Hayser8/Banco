"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredTransactions = transactions.filter((txn) =>
    (txn.id_transaccion.includes(search) || txn.fecha_hora.includes(search)) &&
    (statusFilter === "all" || (txn.estado.toLowerCase() === statusFilter || (txn.estado === "Completada" && statusFilter === "exitosa")))
  );

  if (loading) return <div className="text-white">Cargando transacciones...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

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
            <option value="exitosa">Exitosas</option>
            <option value="pendiente">Pendientes</option>
            <option value="fallida">Fallidas</option>
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
              <th className="py-3 px-4 text-left">Tipo</th>
              <th className="py-3 px-4 text-left">Destino/Remitente</th>
              <th className="py-3 px-4 text-left">Concepto</th>
              <th className="py-3 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => {
              const esEnvio = txn.tipo === "Enviado"; 
              return (
                <tr key={txn.id_transaccion} className="border-b border-gray-700">
                  <td className="py-3 px-4">{txn.id_transaccion}</td>
                  <td className="py-3 px-4">{new Date(txn.fecha_hora).toLocaleString()}</td>
                  <td className="py-3 px-4 text-blue-400">${txn.monto.toFixed(2)}</td>

                  {/* Indicar si es envío o recepción */}
                  <td className="py-3 px-4">
                    {esEnvio ? (
                      <span className="text-red-400 flex items-center">
                        <FiArrowUpRight className="mr-2" /> Enviado
                      </span>
                    ) : (
                      <span className="text-green-400 flex items-center">
                        <FiArrowDownLeft className="mr-2" /> Recibido
                      </span>
                    )}
                  </td>

                  {/* Mostrar destinatario o remitente */}
                  <td className="py-3 px-4">{esEnvio ? txn.cuenta_destino : txn.cuenta_origen}</td>

                  {/* Mostrar concepto */}
                  <td className="py-3 px-4">{txn.concepto || "Sin concepto"}</td>

                  {/* Estado de la transacción */}
                  <td className="py-3 px-4">
                    {txn.estado === "Completada" || txn.estado.toLowerCase() === "exitosa" ? (
                      <span className="text-green-400 flex items-center">
                        <FiCheckCircle className="mr-2" /> Exitosa
                      </span>
                    ) : txn.estado.toLowerCase() === "pendiente" ? (
                      <span className="text-yellow-400 flex items-center">
                        <FiClock className="mr-2" /> Pendiente
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        <FiXCircle className="mr-2" /> Fallida
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
