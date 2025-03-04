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
    "id:ID", ":LABEL", "cliente_nombre", "cliente_fecha_nacimiento", "cliente_email", "cliente_telefono",
    "cliente_direcciones", "cliente_riesgo_acumulado", "tarjeta_tipo_tarjeta", "tarjeta_limite_credito",
    "tarjeta_estatus", "tarjeta_fecha_vencimiento", "tarjeta_número_tarjeta", "tarjeta_emisor",
    "alerta_descripción", "alerta_fecha_creación", "alerta_nivel_severidad", "alerta_resuelta",
    "comercio_nombre", "comercio_categoría", "comercio_ubicación", "comercio_reputación",
    "transaccion_monto", "transaccion_fecha_hora", "transaccion_tipo", "transaccion_estado",
    "transaccion_ubicación", "transaccion_num_cuent_origen", "transaccion_num_cuent_destino",
    "transaccion_país_origen", "transaccion_país_destino", "transaccion_moneda", "transaccion_banco_destino",
    "cuenta_tipo", "cuenta_saldo_actual", "cuenta_fecha_creación", "cuenta_estatus",
    "cuenta_moneda", "cuenta_saldo_mínimo", "dispositivo_tipo_dispositivo", "dispositivo_ubicación",
    "dispositivo_estatus_riesgo"
]

EXPECTED_RELATIONSHIP_COLUMNS = [
    ":START_ID", ":END_ID", ":TYPE", "frecuencia_uso", "ubicaciones_frecuentes", "estatus_riesgo_usa",
    "fecha_apertura", "estatus_actual_posee", "saldo_promedio", "canal_realiza", "comentario",
    "rol", "tipo_pago_ocurre", "estatus_fraude_ocurre", "razon_fraude", "evidencia",
    "acciones_tomadas", "motivo_alerta", "nivel_riesgo_alerta", "acción_inicial",
    "estatus_fraude_disp", "direccion_ip", "tipo_conexion", "banco_emisor", "transacciones_totales",
    "linked_date", "tipo_pago_tarjeta", "estatus_fraude_tarjeta", "canal_uso"
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
    """Inserta los nodos y relaciones en Neo4j"""
    with get_db_session() as session:
        # Insertar nodos
        for index, row in nodes_df.iterrows():
            node_id = row["id:ID"]
            label = row[":LABEL"]
            # Convertir las demás columnas a propiedades (omite id y label)
            properties = row.to_dict()
            properties.pop("id:ID", None)
            properties.pop(":LABEL", None)
            cypher = f"MERGE (n:{label} {{id: $id}}) SET n += $props"
            session.run(cypher, id=node_id, props=properties)
        # Insertar relaciones
        for index, row in relationships_df.iterrows():
            start_id = row[":START_ID"]
            end_id = row[":END_ID"]
            rel_type = row[":TYPE"]
            properties = row.to_dict()
            properties.pop(":START_ID", None)
            properties.pop(":END_ID", None)
            properties.pop(":TYPE", None)
            cypher = f"""
                MATCH (a {{id: $start_id}}), (b {{id: $end_id}})
                MERGE (a)-[r:{rel_type}]->(b)
                SET r += $props
            """
            session.run(cypher, start_id=start_id, end_id=end_id, props=properties)

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
