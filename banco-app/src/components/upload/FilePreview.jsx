"use client";

export default function FilePreview({ file }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-borderColor mt-6">
      <h3 className="text-xl font-semibold mb-2">Previsualización del Archivo</h3>
      <p className="text-textSecondary">Nombre: {file.name}</p>
      <p className="text-textSecondary">Tamaño: {(file.size / 1024).toFixed(2)} KB</p>
    </div>
  );
}
