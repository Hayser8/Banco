from fastapi import APIRouter
from neo4j import GraphDatabase, basic_auth

dashboard_router = APIRouter()

URI = "bolt://44.204.125.164"
AUTH = basic_auth("neo4j", "regrets-plates-break")

@dashboard_router.get("/general_metrics")
def get_general_metrics(days: int = None):

    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            if days:

                total_transacciones = session.run(
                    f"""
                    MATCH (t:Transaccion)
                    WHERE t.fecha_hora >= datetime() - duration('P{days}D')
                    RETURN count(t) AS total
                    """
                ).single()["total"]
                

                total_cuentas = session.run(
                    f"""
                    MATCH (cu:Cuenta)
                    WHERE cu.fecha_creacion >= datetime() - duration('P{days}D')
                    RETURN count(cu) AS total
                    """
                ).single()["total"]
                

                total_clientes = session.run("""
                    MATCH (c:Cliente)
                    RETURN count(c) AS total
                """).single()["total"]
            else:

                total_transacciones = session.run("""
                    MATCH (t:Transaccion)
                    RETURN count(t) AS total
                """).single()["total"]
                
                total_cuentas = session.run("""
                    MATCH (cu:Cuenta)
                    RETURN count(cu) AS total
                """).single()["total"]
                
                total_clientes = session.run("""
                    MATCH (c:Cliente)
                    RETURN count(c) AS total
                """).single()["total"]
        return {
            "total_transacciones": total_transacciones,
            "total_clientes": total_clientes,
            "total_cuentas": total_cuentas
        }
    finally:
        driver.close()


@dashboard_router.get("/fraud_metrics")
def get_fraud_metrics(days: int = 7):

    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            active_alerts = session.run(
                f"""
                MATCH (a:Alerta)
                WHERE a.resuelta = false
                  AND a.fecha_creacion >= datetime() - duration('P{days}D')
                RETURN count(a) AS total
                """
            ).single()["total"]
            
            confirmed_frauds = session.run(
                f"""
                MATCH (a:Alerta)
                WHERE a.fraude_confirmado = true
                  AND a.fecha_creacion >= datetime() - duration('P{days}D')
                RETURN count(a) AS confirmed
                """
            ).single()["confirmed"]
        return {
            "active_fraud_alerts": active_alerts,
            "fraud_confirmed": confirmed_frauds
        }
    finally:
        driver.close()


@dashboard_router.get("/fraud_chart")
def get_fraud_chart(days: int = 7):

    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            query = f"""
                MATCH (a:Alerta)
                WHERE a.resuelta = false
                  AND a.fecha_creacion >= datetime() - duration('P{days}D')
                RETURN date(a.fecha_creacion) AS fecha, count(a) AS total
                ORDER BY fecha
            """
            results = session.run(query)
            data = []
            for record in results:
                fecha = record["fecha"]
                data.append({"fecha": fecha.isoformat(), "total": record["total"]})
        return {"fraud_chart": data}
    finally:
        driver.close()


@dashboard_router.get("/transactions_chart")
def get_transactions_chart(days: int = 7):

    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            query = f"""
                MATCH (t:Transaccion)
                WHERE t.fecha_hora >= datetime() - duration('P{days}D')
                RETURN date(t.fecha_hora) AS fecha, count(t) AS total
                ORDER BY fecha
            """
            results = session.run(query)
            data = []
            for record in results:
                fecha = record["fecha"]
                data.append({"fecha": fecha.isoformat(), "total": record["total"]})
        return {"transactions_chart": data}
    finally:
        driver.close()
