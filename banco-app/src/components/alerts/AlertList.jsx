"use client";

export default function AlertList({ alerts, onSelectAlert, onRemoveAlert }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Lista de Alertas</h2>
      {alerts.length === 0 ? (
        <p className="text-textSecondary">No hay alertas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map(alert => (
            <li key={alert.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
              <span className="cursor-pointer" onClick={() => onSelectAlert(alert)}>
                {alert.nombre}
              </span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemoveAlert(alert.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
