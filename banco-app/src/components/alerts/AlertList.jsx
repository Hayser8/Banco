"use client";

import { useState } from "react";

export default function AlertList({ alerts, onSelectAlert, onRemoveAlerts, onResolveAlerts }) {
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  // Alterna la selección de una alerta
  const toggleAlertSelection = (alertId) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  // Función para limpiar la selección después de la acción
  const clearSelection = () => {
    setSelectedAlerts([]);
  };

  return (
    <div className="relative bg-card p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        Alertas No Resueltas
        {selectedAlerts.length > 0 && (
          <span className="text-sm text-gray-400">Seleccionadas: {selectedAlerts.length}</span>
        )}
      </h2>

      {(!alerts || alerts.length === 0) ? (
        <p className="text-textSecondary text-center py-4">No hay alertas registradas.</p>
      ) : (
        <div className="max-h-[400px] overflow-auto">
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li
                key={alert.id_alerta}
                className={`flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition ${
                  selectedAlerts.includes(alert.id_alerta) ? "border-blue-500 bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id_alerta)}
                    onChange={() => toggleAlertSelection(alert.id_alerta)}
                    className="cursor-pointer accent-blue-500"
                  />
                  <div onClick={() => onSelectAlert(alert)} className="cursor-pointer">
                    <p className="font-semibold text-white">{alert.motivo || `Alerta ${alert.id_alerta}`}</p>
                    <p className="text-sm text-gray-400">Cliente: {alert.nombre_cliente}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones flotantes para acciones rápidas */}
      {selectedAlerts.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => {
              onResolveAlerts(selectedAlerts);
              clearSelection();
            }}
          >
            ✅ Marcar como Vistas ({selectedAlerts.length})
          </button>

          <button
            className="bg-red-600 px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={() => {
              onRemoveAlerts(selectedAlerts);
              clearSelection();
            }}
          >
            ❌ Eliminar ({selectedAlerts.length})
          </button>
        </div>
      )}
    </div>
  );
}
