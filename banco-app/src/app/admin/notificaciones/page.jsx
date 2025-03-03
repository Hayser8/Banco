"use client";
import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const loadTodayNotifs = () => {
    fetch("http://localhost:8080/notifications/today")
      .then(res => res.json())
      .then(data => {
        console.log("Notifs de hoy:", data);
        setNotifications(data.notifications || []);
      })
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    loadTodayNotifs();
    // Polling cada 10s, por ejemplo
    const intervalId = setInterval(loadTodayNotifs, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleViewNotification = (id_alerta) => {
    // Llamamos a /notifications/{id_alerta}/view (PATCH)
    fetch(`http://localhost:8080/notifications/${id_alerta}/view`, { method: "PATCH" })
      .then(res => res.json())
      .then(data => {
        console.log("Notificacion vista:", data);
        // Quitar del array local
        setNotifications(prev => prev.filter(n => n.id_alerta !== id_alerta));
      })
      .catch(err => console.error("Error al marcar vista:", err));
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Notificaciones de Hoy</h1>
      {notifications.length === 0 ? (
        <p>No tienes notificaciones pendientes</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notif => (
            <li key={notif.id_alerta} className="bg-gray-800 p-4 rounded">
              <p><strong>ID:</strong> {notif.id_alerta}</p>
              <p><strong>Descripción:</strong> {notif.descripcion}</p>
              <p><strong>Fecha Creación:</strong> {notif.fecha_creacion}</p>
              {/* Botón que al "ver" la notificación, la quita */}
              <button
                onClick={() => handleViewNotification(notif.id_alerta)}
                className="mt-2 bg-blue-600 px-4 py-2 rounded"
              >
                Ver / Ocultar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
