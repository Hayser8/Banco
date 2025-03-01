"use client";

export default function AlertDetails({ alert }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-2xl font-bold mb-2">{alert.nombre}</h2>
      <p className="text-textSecondary mb-4">{alert.descripcion}</p>
      <p><strong>Comercio:</strong> {alert.comercio}</p>
      <p><strong>Fecha:</strong> {new Date(alert.fecha).toLocaleDateString()}</p>
    </div>
  );
}
