export default function Table() {
    return (
      <table className="w-full mt-4 text-left border-collapse">
        <thead>
          <tr className="bg-card text-textPrimary">
            <th className="p-3">Fecha</th>
            <th className="p-3">Monto</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-borderColor">
            <td className="p-3">01/03/2025</td>
            <td className="p-3">$250.00</td>
            <td className="p-3 text-green-400">Completado</td>
          </tr>
        </tbody>
      </table>
    );
  }
  