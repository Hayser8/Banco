"use client";
import { useRef } from "react";

export default function FileUpload({ label, setFile }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setFile(file);
    } else {
      alert("Error: Solo se permiten archivos CSV.");
    }
  };

  return (
    <div className="border-dashed border-2 border-primary p-6 text-center bg-card rounded-lg mt-4">
      <p className="font-semibold">{label}</p>
      <input type="file" className="hidden" accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
      <button
        className="mt-2 bg-secondary text-white px-4 py-2 rounded"
        onClick={() => fileInputRef.current.click()}
      >
        Seleccionar Archivo
      </button>
    </div>
  );
}
