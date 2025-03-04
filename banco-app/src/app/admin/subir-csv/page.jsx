"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import FileUpload from "../../../components/upload/FileUpload";
import FilePreview from "../../../components/upload/FilePreview";
import UploadStatus from "../../../components/upload/UploadStatus";

// Importar Cytoscape de forma dinámica para evitar problemas con SSR
const CytoscapeComponent = dynamic(() => import("react-cytoscapejs"), {
  ssr: false,
});

export default function Page() {
  const [nodesFile, setNodesFile] = useState(null);
  const [relationsFile, setRelationsFile] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Encabezados esperados (COINCIDEN CON TU CSV)
  const expectedHeaders = {
    nodes: [
      "id:ID",
      ":LABEL",
      "nombre",
      "fecha_nacimiento",
      "email",
      "telefono",
      "direcciones",
      "riesgo_acumulado",
      "rol",
      "tipo_tarjeta",
      "limite_credito",
      "estatus",
      "fecha_vencimiento",
      "numero_tarjeta",
      "emisor",
      "descripcion_alerta",
      "fecha_creacion_alerta",
      "nivel_severidad_alerta",
      "resuelta_alerta",
      "fraude_confirmado_alerta",
      "nombre_comercio",
      "categoria_comercio",
      "ubicacion_comercio",
      "reputacion_comercio",
      "monto_transaccion",
      "fecha_hora_transaccion",
      "tipo_transaccion",
      "estado_transaccion",
      "ubicacion_transaccion",
      "num_cuenta_origen",
      "num_cuenta_destino",
      "pais_origen",
      "pais_destino",
      "moneda_transaccion",
      "banco_destino",
      "tipo_cuenta",
      "saldo_actual",
      "fecha_creacion_cuenta",
      "estatus_cuenta",
      "moneda_cuenta",
      "saldo_minimo",
      "tipo_dispositivo",
      "ubicacion_dispositivo",
      "estatus_riesgo_dispositivo"
    ],
    relationships: [
      ":START_ID",
      ":END_ID",
      ":TYPE",
      "frecuencia_uso",
      "ubicaciones_frecuentes",
      "estatus_riesgo",
      "fecha_apertura",
      "estatus_actual",
      "saldo_promedio",
      "canal",
      "comentario",
      "rol",
      "tipo_pago",
      "estatus_fraude",
      "razon_fraude",
      "evidencia",
      "acciones_tomadas",
      "motivo_alerta",
      "nivel_riesgo",
      "accion_inicial",
      "direccion_ip",
      "tipo_conexion",
      "banco_emisor",
      "transacciones_totales",
      "linked_date",
      "canal_uso"
    ],
  };  

  const handleFileUpload = async () => {
    if (!nodesFile || !relationsFile) {
      setUploadStatus("Error: Debes subir ambos archivos (Nodos y Relaciones).");
      return;
    }

    // Parsear CSV de Nodos y Relaciones para validación y generación del grafo
    const nodesData = await parseCSV(nodesFile, expectedHeaders.nodes);
    const relationsData = await parseCSV(relationsFile, expectedHeaders.relationships);

    // Revisar si hay errores de validación
    if (nodesData.errors.length > 0) {
      setUploadStatus(`Error en Nodes CSV: ${nodesData.errors.join("; ")}`);
      return;
    }
    if (relationsData.errors.length > 0) {
      setUploadStatus(`Error en Relationships CSV: ${relationsData.errors.join("; ")}`);
      return;
    }

    // Crear el grafo para visualizarlo
    const graph = buildGraph(nodesData.data, relationsData.data);
    setGraphData(graph);

    // Realizar la subida a la base de datos llamando al endpoint del backend
    const formData = new FormData();
    formData.append("nodes", nodesFile);
    formData.append("relationships", relationsFile);

    try {
      const response = await fetch("http://localhost:8080/upload-csv/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setUploadStatus(`Error al subir datos a la DB: ${result.detail}`);
      } else {
        setUploadStatus("Archivos validados, grafo generado y datos subidos correctamente a la base de datos.");
      }
    } catch (error) {
      setUploadStatus("Error al conectar con el servidor: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Subir CSV y Visualizar Grafo 📂</h1>
      <p className="text-textSecondary mb-6">
        Sube los archivos CSV para nodos y relaciones. Se validará su estructura, se generará el grafo y se subirá la información a la base de datos.
      </p>

      <FileUpload label="Subir CSV de Nodos" setFile={setNodesFile} />
      <FileUpload label="Subir CSV de Relaciones" setFile={setRelationsFile} />

      {nodesFile && <FilePreview file={nodesFile} />}
      {relationsFile && <FilePreview file={relationsFile} />}

      {uploadStatus && <UploadStatus status={uploadStatus} />}

      <button
        className="bg-primary text-white px-4 py-2 rounded-lg mt-4"
        onClick={handleFileUpload}
      >
        Validar, Generar Grafo y Subir a DB
      </button>

      {graphData && (
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Vista Preliminar del Grafo</h2>
          <CytoscapeComponent
            elements={graphData}
            style={{ width: "100%", height: "500px" }}
            layout={{ name: "cose" }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Lee el archivo CSV, valida cabeceras y el número de columnas en cada línea.
 * Devuelve: { errors: string[], data: string[][] }
 */
async function parseCSV(file, expectedHeaders) {
  const text = await file.text();

  // Dividir líneas, ignorando las vacías
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (!lines.length) {
    return { errors: ["El archivo está vacío"], data: [] };
  }

  // Usar parseCSVLine para parsear cada línea
  const parsedLines = lines.map(line => parseCSVLine(line));

  // La primera línea son los encabezados
  const headers = parsedLines[0];
  const colCount = headers.length;

  // Validar que todas las columnas esperadas estén presentes
  const missing = expectedHeaders.filter(h => !headers.includes(h));
  if (missing.length > 0) {
    return { errors: [`Faltan columnas: ${missing.join(", ")}`], data: [] };
  }

  // Parsear el resto de las líneas (saltamos la cabecera)
  const rawData = parsedLines.slice(1);

  // Filtrar filas que no tengan colCount columnas
  const validRows = [];
  const errors = [];
  rawData.forEach((row, idx) => {
    if (row.length !== colCount) {
      errors.push(`Fila ${idx + 2} tiene ${row.length} columnas en lugar de ${colCount}`);
    } else {
      validRows.push(row);
    }
  });

  return { errors, data: validRows };
}

/**
 * Función que parsea una línea CSV respetando las comillas.
 * Si un campo está entre comillas, las comas internas no se consideran separadores.
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Si estamos en comillas y el siguiente también es comilla, es una comilla escapada
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // saltar el siguiente carácter
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Separador de campo
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Crea nodos y edges para Cytoscape.
 *
 * - nodesData[i][0] = id:ID
 * - nodesData[i][1] = :LABEL
 * - relationshipsData[i][0] = :START_ID
 * - relationshipsData[i][1] = :END_ID
 * - relationshipsData[i][2] = :TYPE
 */
function buildGraph(nodesData, relationshipsData) {
  // 1) Extraer los IDs de nodos válidos (col 0 = id:ID)
  const validNodeIds = new Set(nodesData.map(row => row[0]?.trim()).filter(Boolean));

  // 2) Construir nodos (filtrando filas sin id)
  const nodes = nodesData
    .filter(row => row[0]?.trim())
    .map(row => ({
      data: {
        id: row[0].trim(),
        label: row[1]?.trim() || "SinLabel",
      },
    }));

  // 3) Construir edges: filtrar filas con source/target no vacíos y que existan en nodos
  const edges = relationshipsData
    .filter(row => row[0]?.trim() && row[1]?.trim())
    .filter(row => validNodeIds.has(row[0].trim()) && validNodeIds.has(row[1].trim()))
    .map(row => ({
      data: {
        source: row[0].trim(),
        target: row[1].trim(),
        label: row[2]?.trim() || "Relación",
      },
    }));

  console.log("Nodos generados:", nodes.length);
  console.log("Edges generados:", edges.length);

  return [...nodes, ...edges];
}
