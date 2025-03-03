from fastapi import APIRouter
from typing import Optional
from neo4j import GraphDatabase, basic_auth

historial_router = APIRouter()

@historial_router.get("/transacciones_busqueda")
def get_transacciones(
    status: Optional[str] = None,
    days: Optional[int] = None,
    search: Optional[str] = None
):

    driver = GraphDatabase.driver(
        "bolt://3.92.180.104:7687",
        auth=basic_auth("neo4j", "prime-sponge-exhibit")
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
            data.append({
                "transaccion_id": record["transaccion_id"],
                "cliente": record["cliente"],
                "fecha": record["fecha"].isoformat() if record["fecha"] else None,
                "monto": record["monto"],
                "estado": record["estado"],
                "es_fraudulenta": record["es_fraudulenta"]
            })

    return {"transacciones": data}
