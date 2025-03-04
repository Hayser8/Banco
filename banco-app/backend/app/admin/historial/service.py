from fastapi import APIRouter
from typing import Optional
from neo4j import GraphDatabase, basic_auth
from datetime import datetime

historial_router = APIRouter()

@historial_router.get("/transacciones_busqueda")
def get_transacciones(
    status: Optional[str] = None,
    days: Optional[int] = None,
    search: Optional[str] = None
):

    driver = GraphDatabase.driver(
        "bolt://44.204.125.164",
        auth=basic_auth("neo4j", "regrets-plates-break")
    )

    with driver.session(database="neo4j") as session:
        query = """
            MATCH (c:Cliente)-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            OPTIONAL MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta)
            WHERE 1=1
        """
        params = {}

        if status:
            query += " AND tx.estado = $status"
            params["status"] = status

        if days:
            query += f" AND tx.fecha_hora >= datetime() - duration('P{days}D')"

        if search:
            query += """
                AND (
                    toLower(tx.id_transaccion) CONTAINS toLower($search)
                    OR toLower(c.nombre) CONTAINS toLower($search)
                )
            """
            params["search"] = search

        query += """
            WITH tx, c, collect(a) AS alerts
            RETURN
                tx.id_transaccion AS transaccion_id,
                c.nombre AS cliente,
                tx.fecha_hora AS fecha,
                tx.monto AS monto,
                tx.estado AS estado,
                ANY(al IN alerts WHERE al.fraude_confirmado = true) AS es_fraudulenta
            ORDER BY fecha DESC
        """

        results = session.run(query, params)
        data = []
        for record in results:
            fecha_value = record["fecha"]
            fecha_formatted = None
            if fecha_value:
                try:
                    # Si el valor ya posee isoformat, se asume que es un objeto datetime o similar
                    if hasattr(fecha_value, "isoformat"):
                        fecha_formatted = fecha_value.isoformat()
                    else:
                        # Intentamos convertirlo asumiendo que es un string en formato ISO
                        fecha_dt = datetime.fromisoformat(fecha_value)
                        fecha_formatted = fecha_dt.isoformat()
                except Exception as e:
                    # Si falla la conversión, dejamos el string original
                    fecha_formatted = str(fecha_value)
            data.append({
                "transaccion_id": record["transaccion_id"],
                "cliente": record["cliente"],
                "fecha": fecha_formatted,
                "monto": record["monto"],
                "estado": record["estado"],
                "es_fraudulenta": record["es_fraudulenta"]
            })

    return {"transacciones": data}
