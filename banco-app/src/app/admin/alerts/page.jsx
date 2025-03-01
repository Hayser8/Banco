"use client";

import { useState, useEffect } from "react";
import AlertList from "../../../components/alerts/AlertList";
import AlertDetails from "../../../components/alerts/AlertDetails";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetch("http://192.168.1.36:8080/alerts")
      .then(response => response.json())
      .then(data => setAlerts(data.alerts))
      .catch(error => console.error("Error al obtener alertas:", error));
  }, []);

  const removeAlert = (id) => {
    fetch(`http://192.168.1.36:8080/alerts/${id}`, { method: "DELETE" })
      .then(() => setAlerts(alerts.filter(alert => alert.id !== id)))
      .catch(error => console.error("Error al eliminar alerta:", error));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Administrar Alertas 🚨</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AlertList alerts={alerts} onSelectAlert={setSelectedAlert} onRemoveAlert={removeAlert} />
        </div>
        <div className="md:col-span-2">
          {selectedAlert ? (
            <AlertDetails alert={selectedAlert} />
          ) : (
            <p className="text-textSecondary">Selecciona una alerta para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
