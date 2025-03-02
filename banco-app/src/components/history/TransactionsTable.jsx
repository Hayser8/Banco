"use client";

import TableRow from "./TableRow";

export default function TransactionsTable({ transactions, searchQuery }) {
  const filteredTransactions = transactions.filter((txn) => {
    const idStr = (txn.transaccion_id || "").toLowerCase();
    const clienteStr = (txn.cliente || "").toLowerCase();
    const searchStr = (searchQuery || "").toLowerCase();

    return (
      idStr.includes(searchStr) ||
      clienteStr.includes(searchStr)
    );
  });

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-card text-textPrimary">
            <th className="p-3">ID</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Monto</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn) => (
            <TableRow key={txn.transaccion_id} transaction={txn} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
