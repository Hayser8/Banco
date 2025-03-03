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

  const removeAlert = (id_alerta) => {
    fetch(`http://localhost:8080/alerts/${id_alerta}`, { method: "DELETE" })
      .then(() => {
        setAlerts((prev) => prev.filter((a) => a.id_alerta !== id_alerta));
        if (selectedAlert && selectedAlert.id_alerta === id_alerta) {
          setSelectedAlert(null);
        }
      })
      .catch((error) => console.error("Error al eliminar alerta:", error));
  };

  const resolveAlert = (id_alerta) => {
    fetch(`http://localhost:8080/alerts/${id_alerta}/resolve`, { method: "PATCH" })
      .then(() => {

        setAlerts((prev) => prev.filter((a) => a.id_alerta !== id_alerta));
        if (selectedAlert && selectedAlert.id_alerta === id_alerta) {
          setSelectedAlert(null);
        }
      })
      .catch((error) => console.error("Error al resolver alerta:", error));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Alertas Pendientes (No resueltas)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AlertList
            alerts={alerts}
            onSelectAlert={setSelectedAlert}
            onRemoveAlert={removeAlert}
          />
        </div>
        <div className="md:col-span-2">
          {selectedAlert ? (
            <AlertDetails
              alert={selectedAlert}
              onRemoveAlert={removeAlert}
              onResolveAlert={resolveAlert}
            />
          ) : (
            <p className="text-textSecondary">Selecciona una alerta para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}