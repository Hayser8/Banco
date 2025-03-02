from fastapi import APIRouter, Query
from typing import Optional
from neo4j import GraphDatabase, basic_auth

historial_router = APIRouter()

@historial_router.get("/transacciones_busqueda")
def get_transacciones(
    status: Optional[str] = None,
    days: Optional[int] = None,
    search: Optional[str] = None
):
    """
    Retorna:
      - transaccion_id (real),
      - cliente (nombre),
      - fecha,
      - monto,
      - estado.
    Se unen los nodos: Cliente -> Cuenta -> Transaccion, evitando duplicados.
    """
    driver = GraphDatabase.driver(
        "bolt://3.92.180.104:7687",
        auth=basic_auth("neo4j", "prime-sponge-exhibit")
    )

    with driver.session(database="neo4j") as session:
        query = """
            MATCH (c:Cliente)-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            OPTIONAL MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WHERE tx IS NOT NULL
        """
        params = {}

        if status:
            query += " AND tx.estado = $status"
            params["status"] = status

        if days:
            query += " AND tx.fecha_hora >= datetime() - duration({days: $days})"
            params["days"] = days

        if search:
            query += """
                AND (
                    toLower(tx.id_transaccion) CONTAINS toLower($search)
                    OR toLower(c.nombre) CONTAINS toLower($search)
                )
            """
            params["search"] = search

        query += """
            WITH tx.id_transaccion AS transaccion_id, 
                 head(collect(DISTINCT c.nombre)) AS cliente, 
                 tx.fecha_hora AS fecha, 
                 tx.monto AS monto, 
                 tx.estado AS estado
            RETURN transaccion_id, cliente, fecha, monto, estado
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
            })

    return {"transacciones": data}
