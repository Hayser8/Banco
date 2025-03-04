from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth

notifications_today_router = APIRouter()

URI = "bolt://3.92.180.104:7687"
AUTH = basic_auth("neo4j", "prime-sponge-exhibit")

@notifications_today_router.get("/notifications/today")
def get_today_notifications():
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            query = """
            MATCH (a:Alerta)
            WHERE a.resuelta=false
              AND a.vista=false
              AND date(a.fecha_creacion)=date()
            RETURN 
              a.id_alerta AS id_alerta,
              a.descripcion AS descripcion,
              a.fecha_creacion AS fecha_creacion
            ORDER BY a.fecha_creacion DESC
            """
            results = session.run(query)
            data = []
            alert_ids = []
            for record in results:
                data.append({
                    "id_alerta": record["id_alerta"],
                    "descripcion": record["descripcion"],
                    "fecha_creacion": record["fecha_creacion"].isoformat() if record["fecha_creacion"] else None
                })
                alert_ids.append(record["id_alerta"])

            if alert_ids:
                session.run("""
                MATCH (a:Alerta)
                WHERE a.id_alerta IN $alert_ids
                SET a.vista = true
                """, {"alert_ids": alert_ids})

            return {"notifications": data}
    finally:
        driver.close()

@notifications_today_router.get("/notifications/today/count")
def get_today_notifications_count():

    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            query = """
            MATCH (a:Alerta)
            WHERE a.resuelta=false
              AND a.vista=false
              AND date(a.fecha_creacion)=date()
            RETURN count(a) AS total
            """
            result = session.run(query).single()
            return {"count": result["total"]}
    finally:
        driver.close()

@notifications_today_router.patch("/notifications/{alert_id}/view")
def view_notification(alert_id: str):
    """
    Marca la alerta como vista => vista=true (deja de aparecer en /notifications/today).
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            check_query = """
            MATCH (a:Alerta {id_alerta:$alert_id, vista:false})
            RETURN a
            """
            check = session.run(check_query, {"alert_id": alert_id}).single()
            if not check:
                return {"detail": "Alerta no existe o ya fue vista"}

            update_query = """
            MATCH (a:Alerta {id_alerta:$alert_id})
            SET a.vista = true
            RETURN a.id_alerta AS id
            """
            r = session.run(update_query, {"alert_id": alert_id}).single()
            return {"detail": f"Notificación {r['id']} marcada como vista"}
    finally:
        driver.close()
