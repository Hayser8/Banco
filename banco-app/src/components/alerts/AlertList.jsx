"use client";

export default function AlertList({ alerts, onSelectAlert, onRemoveAlert }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Lista de Alertas No Resueltas</h2>
      {(!alerts || alerts.length === 0) ? (
        <p className="text-textSecondary">No hay alertas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.id_alerta}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
            >
              {/* Muestra el motivo o "Alerta X" */}
              <span
                className="cursor-pointer"
                onClick={() => onSelectAlert(alert)}
              >
                {alert.motivo || `Alerta ${alert.id_alerta}`}
              </span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemoveAlert(alert.id_alerta)}
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
