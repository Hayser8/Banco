"use client";

import { useState } from "react";
import FileUpload from "../../../components/upload/FileUpload";
import FilePreview from "../../../components/upload/FilePreview";
import UploadStatus from "../../../components/upload/UploadStatus";

export default function SubirCSV() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Subir CSV 📂</h1>
      <p className="text-textSecondary mb-6">
        Arrastra y suelta un archivo CSV aquí o selecciónalo manualmente.
      </p>

      {/* Componente de carga de archivos */}
      <FileUpload setFile={setFile} setUploadStatus={setUploadStatus} />

      {/* Previsualización del archivo */}
      {file && <FilePreview file={file} />}

      {/* Estado de la subida */}
      {uploadStatus && <UploadStatus status={uploadStatus} />}
    </div>
  );
}
