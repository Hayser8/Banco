"use client";

import { useRef } from "react";

export default function FileUpload({ setFile, setUploadStatus }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setFile(file);
      setUploadStatus("Archivo listo para subir.");
    } else {
      setUploadStatus("Error: Solo se permiten archivos CSV.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setFile(file);
      setUploadStatus("Archivo listo para subir.");
    } else {
      setUploadStatus("Error: Solo se permiten archivos CSV.");
    }
  };

  return (
    <div
      className="border-dashed border-2 border-primary p-6 text-center cursor-pointer bg-card rounded-lg hover:bg-opacity-90 transition"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <p className="text-textSecondary">Arrastra y suelta un archivo CSV aquí o haz clic para seleccionarlo.</p>
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}
