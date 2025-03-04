from fastapi import APIRouter, File, UploadFile, HTTPException
import pandas as pd
from neo4j import GraphDatabase, basic_auth
import io

# Crear el router para la carga de CSV
csv_router = APIRouter(tags=["CSV Upload"])

DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

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

def insert_data_to_neo4j(nodes_df, relationships_df):
    with get_db_session() as session:
        # Insertar nodos
        csvId_to_uuid = {}

        for _, row in nodes_df.iterrows():
            csv_id = str(row["id:ID"]).strip()
            label = row[":LABEL"].replace(" ", "_")

            properties = {k: v for k, v in row.items() if pd.notna(v)}
            properties.pop("id:ID", None)
            properties.pop(":LABEL", None)

            # MERGE usando csv_id como identificador "real"
            cypher = f"""
                MERGE (n:{label} {{ csv_id: $csv_id }})
                ON CREATE SET n += $props
                RETURN n.csv_id AS realId
            """
            result = session.run(cypher, csv_id=csv_id, props=properties)
            record = result.single()

            # 'realId' será igual a tu csv_id (p.ej 'D1', 'CO12', etc.)
            if record and record["realId"]:
                csvId_to_uuid[csv_id] = record["realId"]  # en realidad guardamos el mismo
                print(f"Nodo insertado: csv_id={csv_id} => realId={record['realId']}")
            else:
                print(f"⚠️ No se pudo insertar el nodo: csv_id={csv_id}")

        # Insertar relaciones
        for _, row in relationships_df.iterrows():
            start_csv_id = str(row[":START_ID"]).strip()
            end_csv_id   = str(row[":END_ID"]).strip()
            rel_type     = str(row[":TYPE"]).strip().replace(" ", "_")

            start_real_id = csvId_to_uuid.get(start_csv_id)
            end_real_id   = csvId_to_uuid.get(end_csv_id)

            if not start_real_id or not end_real_id:
                print(f"❌ No tengo real_id para {start_csv_id} o {end_csv_id}")
                continue

            rel_properties = {k: v for k, v in row.items() if pd.notna(v)}
            rel_properties.pop(":START_ID", None)
            rel_properties.pop(":END_ID", None)
            rel_properties.pop(":TYPE", None)

            # Creas la relación usando la misma property 'csv_id'
            cypher = f"""
                MATCH (a {{ csv_id: $start_id }}), (b {{ csv_id: $end_id }})
                MERGE (a)-[r:{rel_type}]->(b)
                ON CREATE SET r += $rel_props
                RETURN type(r) AS createdRel
            """
            result = session.run(
                cypher,
                start_id=start_real_id,
                end_id=end_real_id,
                rel_props=rel_properties
            )
            record = result.single()
            if record and record["createdRel"]:
                print(f"Relación creada: {start_csv_id} -[{rel_type}]-> {end_csv_id}")




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
