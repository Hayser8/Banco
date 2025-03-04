"use client";

import { useState, useEffect } from "react";
import AlertList from "../../../components/alerts/AlertList";
import AlertDetails from "../../../components/alerts/AlertDetails";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/alerts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Alertas no resueltas:", data);
        setAlerts(data.alerts);
      })
      .catch((error) => console.error("Error al obtener alertas:", error));
  }, []);

  const removeAlerts = (alertIds) => {
    fetch("http://localhost:8080/alerts/batch-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_ids: alertIds }),
    })
      .then(() => {
        setAlerts((prev) => prev.filter((a) => !alertIds.includes(a.id_alerta)));
        if (selectedAlert && alertIds.includes(selectedAlert.id_alerta)) {
          setSelectedAlert(null);
        }
      })
      .catch((error) => console.error("Error al eliminar alertas:", error));
  };

  const resolveAlerts = (alertIds) => {
    fetch("http://localhost:8080/alerts/batch-resolve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_ids: alertIds }),
    })
      .then(() => {
        setAlerts((prev) => prev.filter((a) => !alertIds.includes(a.id_alerta)));
        if (selectedAlert && alertIds.includes(selectedAlert.id_alerta)) {
          setSelectedAlert(null);
        }
      })
      .catch((error) => console.error("Error al marcar alertas como vistas:", error));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🚨 Alertas Pendientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AlertList
            alerts={alerts}
            onSelectAlert={setSelectedAlert}
            onRemoveAlerts={removeAlerts}
            onResolveAlerts={resolveAlerts}
          />
        </div>
        <div className="md:col-span-2">
          {selectedAlert ? (
            <AlertDetails alert={selectedAlert} />
          ) : (
            <p className="text-textSecondary text-center">Selecciona una alerta para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
