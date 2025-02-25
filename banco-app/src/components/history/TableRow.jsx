export default function TableRow({ transaction }) {
    return (
      <tr className="border-t border-borderColor hover:bg-opacity-10 transition">
        <td className="p-3">{transaction.id}</td>
        <td className="p-3">{transaction.cliente}</td>
        <td className="p-3">{transaction.fecha}</td>
        <td className="p-3">${transaction.monto.toFixed(2)}</td>
        <td className={`p-3 font-semibold ${transaction.estado === "Fraudulenta" ? "text-red-500" : "text-green-400"}`}>
          {transaction.estado}
        </td>
      </tr>
    );
  }
  