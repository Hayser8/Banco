import uuid
import re
from fastapi import APIRouter, File, UploadFile, HTTPException
import pandas as pd
from neo4j import GraphDatabase, basic_auth
import io

# Crear el router para la carga de CSV
csv_router = APIRouter(tags=["CSV Upload"])

DB_URI = "bolt://18.206.140.55:7687"
DB_USER = "neo4j"
DB_PASS = "cards-attachment-workload"

def get_db_session():
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

# Definir columnas esperadas para validación
EXPECTED_NODE_COLUMNS = [
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
]

EXPECTED_RELATIONSHIP_COLUMNS = [
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
]

def validate_csv(file: UploadFile, expected_columns):
    """Valida que un archivo CSV tenga las columnas esperadas"""
    try:
        # Leer y decodificar el contenido
        content = file.file.read().decode("utf-8")
        df = pd.read_csv(io.StringIO(content))
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            return False, f"Faltan columnas: {', '.join(missing_columns)}"
        return True, df
    except Exception as e:
        return False, f"Error al procesar CSV: {str(e)}"


def looks_like_uuid(value: str) -> bool:
    """
    Retorna True si 'value' cumple un patrón básico de UUID:
    8-4-4-4-12 = 36 chars, con guiones.
    """
    pattern = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
    return bool(pattern.match(value))


def insert_data_to_neo4j(nodes_df, relationships_df):
    """
    Unifica TODOS los nodos en la propiedad n.uuid, generando un nuevo UUID para IDs 'nuevos'
    (p.e. 'T4'), y usando el UUID directamente si el CSV ya trae un ID con formato UUID.
    Se mapean los nombres de las propiedades de acuerdo a los nombres correctos de los JSON.
    
    - Para nodos de tipo Transaccion:
      * Almacena en 'id_transaccion' el UUID final (no el 'T4').
      * Convierte el 'estado' a minúsculas.
    """

    csv_to_uuid_map = {}

    header_mapping = {
        "descripcion_alerta": "descripcion",
        "fecha_creacion_alerta": "fecha_creacion",
        "nivel_severidad_alerta": "nivel_severidad",
        "resuelta_alerta": "resuelta",
        "fraude_confirmado_alerta": "fraude_confirmado",
        "nombre_comercio": "nombre",
        "categoria_comercio": "categoria",
        "ubicacion_comercio": "ubicacion",
        "reputacion_comercio": "reputacion",
        "monto_transaccion": "monto",
        "fecha_hora_transaccion": "fecha_hora",
        "tipo_transaccion": "tipo",
        "estado_transaccion": "estado",
        "ubicacion_transaccion": "ubicacion",
        "num_cuenta_origen": "num_cuent_origen",
        "num_cuenta_destino": "num_cuent_destino",
        "moneda_transaccion": "moneda",
        "tipo_cuenta": "tipo",
        "fecha_creacion_cuenta": "fecha_creacion",
        "estatus_cuenta": "estatus",
        "moneda_cuenta": "moneda",
        "ubicacion_dispositivo": "ubicacion",
        "estatus_riesgo_dispositivo": "estatus_riesgo"
    }

    with get_db_session() as session:
        # -------------------- (A) Insertar nodos --------------------
        for _, row in nodes_df.iterrows():
            raw_csv_id = str(row["id:ID"]).strip()
            label = row[":LABEL"].replace(" ", "_")

            # 1) Generar/usar UUID para la propiedad n.uuid
            if looks_like_uuid(raw_csv_id):
                final_uuid = raw_csv_id
            else:
                # Genera un nuevo UUID real si el CSV no trae uno válido
                final_uuid = str(uuid.uuid4())

            csv_to_uuid_map[raw_csv_id] = final_uuid

            # 2) Extraer propiedades
            properties = {k: v for k, v in row.items() if pd.notna(v)}
            properties.pop("id:ID", None)
            properties.pop(":LABEL", None)
            properties.pop("id", None)  # Evitar colisión con 'id'

            # 3) Mapear propiedades al nombre correcto
            mapped_properties = {}
            for key, value in properties.items():
                if key in header_mapping:
                    mapped_properties[header_mapping[key]] = value
                else:
                    mapped_properties[key] = value

            # 4) Ajustes especiales para nodos de tipo Transaccion
            if label == "Transaccion":
                # Guardar en id_transaccion el UUID final
                mapped_properties["id_transaccion"] = final_uuid

                # Convertir estado a minúsculas (si existe)
                if "estado" in mapped_properties and mapped_properties["estado"]:
                    mapped_properties["estado"] = mapped_properties["estado"].lower()

            # 5) Insertar el nodo con MERGE
            cypher = f"""
            MERGE (n:{label} {{ uuid: $final_uuid }})
            ON CREATE SET n += $props
            RETURN n.uuid AS createdUuid
            """
            result = session.run(cypher, final_uuid=final_uuid, props=mapped_properties)
            record = result.single()

            if record and record["createdUuid"]:
                print(f"✅ Nodo insertado: CSV_ID={raw_csv_id} => uuid={record['createdUuid']} (label={label})")
            else:
                print(f"⚠️ No se pudo crear nodo para {raw_csv_id}")

        # -------------------- (B) Insertar relaciones --------------------
        for _, row in relationships_df.iterrows():
            start_raw = str(row[":START_ID"]).strip()
            end_raw   = str(row[":END_ID"]).strip()
            rel_type  = str(row[":TYPE"]).strip().replace(" ", "_")

            rel_props = {k: v for k, v in row.items() if pd.notna(v)}
            rel_props.pop(":START_ID", None)
            rel_props.pop(":END_ID", None)
            rel_props.pop(":TYPE", None)

            # Recuperar los uuid
            start_uuid = csv_to_uuid_map.get(start_raw)
            end_uuid = csv_to_uuid_map.get(end_raw)

            if not start_uuid:
                print(f"❌ No tengo uuid para {start_raw}")
                continue
            if not end_uuid:
                print(f"❌ No tengo uuid para {end_raw}")
                continue

            cypher = f"""
            MATCH (a {{ uuid: $start_uuid }}), (b {{ uuid: $end_uuid }})
            MERGE (a)-[r:{rel_type}]->(b)
            ON CREATE SET r += $rel_props
            RETURN type(r) AS createdRel
            """
            result = session.run(
                cypher,
                start_uuid=start_uuid,
                end_uuid=end_uuid,
                rel_props=rel_props
            )
            record = result.single()

            if record and record["createdRel"]:
                print(f"✅ Relación creada: {start_raw} -[{rel_type}]-> {end_raw}")
            else:
                print(f"⚠️ No se pudo crear relacion: {start_raw} -[{rel_type}]-> {end_raw}")





@csv_router.post("/upload-csv/")
async def upload_csv(
    nodes: UploadFile = File(...),
    relationships: UploadFile = File(...)
):
    """
    Sube y valida los archivos CSV de nodos y relaciones, e inserta los datos en Neo4j.
    """
    # Validar CSV de nodos
    valid_nodes, nodes_data = validate_csv(nodes, EXPECTED_NODE_COLUMNS)
    if not valid_nodes:
        raise HTTPException(status_code=400, detail=f"Error en el archivo de nodos: {nodes_data}")
    
    # Validar CSV de relaciones
    valid_relations, relationships_data = validate_csv(relationships, EXPECTED_RELATIONSHIP_COLUMNS)
    if not valid_relations:
        raise HTTPException(status_code=400, detail=f"Error en el archivo de relaciones: {relationships_data}")
    
    # Insertar datos en Neo4j
    try:
        insert_data_to_neo4j(nodes_data, relationships_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error insertando datos a Neo4j: {str(e)}")
    
    return {"message": "Archivos subidos, validados e insertados correctamente en Neo4j"}
