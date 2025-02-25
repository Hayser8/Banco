"use client";

import { useState } from "react";

export default function Preferences() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor">
      <h3 className="text-xl font-semibold mb-4">Preferencias de Usuario ⚙️</h3>
      <div className="flex justify-between items-center mb-4">
        <span>Modo Oscuro</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="w-5 h-5"
        />
      </div>

      <div className="flex justify-between items-center">
        <span>Notificaciones</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}
