from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth

alerts_router = APIRouter()

URI = "bolt://44.204.125.164"
AUTH = basic_auth("neo4j", "regrets-plates-break")

@alerts_router.get("/alerts")
def get_alerts():
    """
    Retorna SOLO alertas con `resuelta = false`, incluyendo:
      - id_alerta
      - id_transaccion
      - nombre_cliente
      - fecha
      - monto
      - comercio (si existe)
      - tipo de transaccion
      - tarjeta (si existe)
      - motivo (si fraude_confirmado, "Fraude confirmado")
      - contacto del cliente (telefono)
      - fraude_confirmado
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            query = """
            MATCH (c:Cliente)-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
                  -[:CUENTA_REALIZA_TRANSACCION|:CUENTA_REALIZA_TRANSACCION_ADMIN]->(tx:Transaccion)
                  -[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {resuelta:false})
            OPTIONAL MATCH (tx)-[:TRANSACCION_OCURRE_EN_COMERCIO]->(co:Comercio)
            OPTIONAL MATCH (t:Tarjeta)-[:TARJETA_UTILIZADA_EN_TRANSACCION]->(tx)
            
            RETURN 
              a.id_alerta          AS id_alerta,
              a.descripcion        AS desc_original,
              a.fraude_confirmado  AS fraude_confirmado,
              tx.id_transaccion    AS id_transaccion,
              c.nombre             AS nombre_cliente,
              c.telefono           AS contacto,
              tx.fecha_hora        AS fecha,
              tx.monto             AS monto,
              co.nombre            AS comercio,
              tx.tipo              AS tipo_transaccion,
              t.numero_tarjeta     AS tarjeta
            ORDER BY fecha DESC
            """
            results = session.run(query)
            
            data = []
            for record in results:
                # si fraude_confirmado es true => motivo = "Fraude confirmado"
                if record["fraude_confirmado"] is True:
                    motivo = "Fraude confirmado"
                else:
                    motivo = record["desc_original"] 

                data.append({
                    "id_alerta": record["id_alerta"],
                    "id_transaccion": record["id_transaccion"],
                    "nombre_cliente": record["nombre_cliente"],
                    "contacto": record["contacto"] or "N/A",
                    "fecha": record["fecha"].isoformat() if record["fecha"] else None,
                    "monto": record["monto"],
                    "comercio": record["comercio"] or "N/A",
                    "tipo_transaccion": record["tipo_transaccion"] or "N/A",
                    "tarjeta": record["tarjeta"] or "N/A",
                    "motivo": motivo,
                    "fraude_confirmado": record["fraude_confirmado"] or False
                })

            return {"alerts": data}
    finally:
        driver.close()

@alerts_router.delete("/alerts/{alert_id}")
def delete_alert(alert_id: str):
    """
    Elimina la alerta en Neo4j (DETACH DELETE).
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            check_query = """
            MATCH (a:Alerta {id_alerta: $alert_id})
            RETURN a.id_alerta AS id
            """
            check_result = session.run(check_query, {"alert_id": alert_id}).single()
            if not check_result:
                raise HTTPException(status_code=404, detail="Alerta no encontrada")
            
            delete_query = """
            MATCH (a:Alerta {id_alerta: $alert_id})
            DETACH DELETE a
            """
            session.run(delete_query, {"alert_id": alert_id})
            return {"detail": f"Alerta {alert_id} eliminada correctamente"}
    finally:
        driver.close()

@alerts_router.patch("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    """
    Marca la alerta como resuelta (resuelta=true), 
    pone fraude_confirmado=false
    en lugar de eliminarla.
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            check_query = """
            MATCH (a:Alerta {id_alerta: $alert_id, resuelta:false})
            RETURN a.id_alerta AS id
            """
            check_result = session.run(check_query, {"alert_id": alert_id}).single()
            if not check_result:
                raise HTTPException(status_code=404, detail="Alerta no encontrada o ya está resuelta")


            update_query = """
            MATCH (a:Alerta {id_alerta: $alert_id})
            SET a.resuelta = true, a.fraude_confirmado = false
            RETURN a.id_alerta AS id
            """
            result = session.run(update_query, {"alert_id": alert_id}).single()
            return {"detail": f"Alerta {result['id']} resuelta correctamente"}
    finally:
        driver.close()

@alerts_router.delete("/alerts/batch-delete")
def delete_multiple_alerts(alert_ids: dict):
    """
    Elimina varias alertas a la vez.
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    alert_list = alert_ids.get("alert_ids", [])
    
    if not alert_list:
        raise HTTPException(status_code=400, detail="No se enviaron alertas para eliminar.")

    try:
        with driver.session(database="neo4j") as session:
            delete_query = """
            MATCH (a:Alerta)
            WHERE a.id_alerta IN $alert_list
            DETACH DELETE a
            """
            session.run(delete_query, {"alert_list": alert_list})
            
        return {"detail": f"Se eliminaron {len(alert_list)} alertas correctamente"}
    finally:
        driver.close()


@alerts_router.patch("/alerts/batch-resolve")
def resolve_multiple_alerts(alert_ids: dict):
    """
    Marca varias alertas como resueltas.
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    alert_list = alert_ids.get("alert_ids", [])

    if not alert_list:
        raise HTTPException(status_code=400, detail="No se enviaron alertas para resolver.")

    try:
        with driver.session(database="neo4j") as session:
            update_query = """
            MATCH (a:Alerta)
            WHERE a.id_alerta IN $alert_list
            SET a.resuelta = true, a.fraude_confirmado = false
            """
            session.run(update_query, {"alert_list": alert_list})
            
        return {"detail": f"Se marcaron {len(alert_list)} alertas como resueltas"}
    finally:
        driver.close()

