"use client";

export default function TableRow({ transaction }) {
  const montoFormateado = transaction.monto?.toFixed
    ? transaction.monto.toFixed(2)
    : transaction.monto;

  return (
    <tr className="border-t border-borderColor hover:bg-opacity-10 transition">
      <td className="p-3">{transaction.transaccion_id}</td>
      <td className="p-3">{transaction.cliente}</td>
      <td className="p-3">{transaction.fecha}</td>
      <td className="p-3">${montoFormateado}</td>
      <td
        className={`p-3 font-semibold ${
          transaction.estado?.toLowerCase() === "fraudulenta"
            ? "text-red-500"
            : "text-green-400"
        }`}
      >
        {transaction.estado}
      </td>
    </tr>
  );
}
