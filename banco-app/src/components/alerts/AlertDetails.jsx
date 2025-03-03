"use client";

export default function AlertDetails({ alert, onRemoveAlert, onResolveAlert }) {
  if (!alert) {
    return <p>No hay alerta seleccionada.</p>;
  }

  const fechaMostrar = alert.fecha
    ? new Date(alert.fecha).toLocaleString()
    : "Sin fecha";

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-2xl font-bold mb-2">Detalles de la Alerta</h2>
      <p><strong>ID Alerta:</strong> {alert.id_alerta}</p>
      <p><strong>ID Transacción:</strong> {alert.id_transaccion}</p>
      <p><strong>Cliente:</strong> {alert.nombre_cliente}</p>
      <p><strong>Contacto:</strong> {alert.contacto}</p>
      <p><strong>Fecha:</strong> {fechaMostrar}</p>
      <p><strong>Monto:</strong> {alert.monto}</p>
      <p><strong>Comercio:</strong> {alert.comercio}</p>
      <p><strong>Tipo Transacción:</strong> {alert.tipo_transaccion}</p>
      <p><strong>Tarjeta:</strong> {alert.tarjeta}</p>
      <p><strong>Motivo:</strong> {alert.motivo}</p>

      <div className="mt-4 flex gap-4">
        {/* Botón Eliminar */}
        <button
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          onClick={() => onRemoveAlert(alert.id_alerta)}
        >
          Eliminar
        </button>

        {/* Botón Resolver */}
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => onResolveAlert(alert.id_alerta)}
        >
          Marcar como Resuelta
        </button>
      </div>
    </div>
  );
}
