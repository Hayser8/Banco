from fastapi import APIRouter
from neo4j import GraphDatabase, basic_auth

dashboard_router = APIRouter()

@dashboard_router.get("/general_metrics")
def get_general_metrics(days: int = None):
    driver = GraphDatabase.driver(
        "bolt://44.203.238.139:7687",
        auth=basic_auth("neo4j", "lieutenants-troubleshooters-freights")
    )
    with driver.session(database="neo4j") as session:
        if days:
            total_transacciones = session.run(
                "MATCH (t:Transaccion) WHERE t.fecha_hora >= datetime() - duration({days: $days}) RETURN count(t) AS total",
                {"days": days}
            ).single()["total"]
            total_cuentas = session.run(
                "MATCH (cu:Cuenta) WHERE cu.fecha_creacion >= datetime() - duration({days: $days}) RETURN count(cu) AS total",
                {"days": days}
            ).single()["total"]
            total_clientes = session.run("MATCH (c:Cliente) RETURN count(c) AS total").single()["total"]
        else:
            total_transacciones = session.run("MATCH (t:Transaccion) RETURN count(t) AS total").single()["total"]
            total_clientes = session.run("MATCH (c:Cliente) RETURN count(c) AS total").single()["total"]
            total_cuentas = session.run("MATCH (cu:Cuenta) RETURN count(cu) AS total").single()["total"]
    return {
        "total_transacciones": total_transacciones,
        "total_clientes": total_clientes,
        "total_cuentas": total_cuentas
    }

@dashboard_router.get("/fraud_metrics")
def get_fraud_metrics(days: int = 7):
    driver = GraphDatabase.driver(
        "bolt://44.203.238.139:7687",
        auth=basic_auth("neo4j", "lieutenants-troubleshooters-freights")
    )
    with driver.session(database="neo4j") as session:
        # Alertas activas (no resueltas) en los últimos X días
        active_alerts = session.run(
            f"""
            MATCH (a:Alerta)
            WHERE a.resuelta = false
              AND a.fecha_creacion >= datetime() - duration('P{days}D')
            RETURN count(a) AS total
            """
        ).single()["total"]
        
        # Alertas de fraude confirmado en los últimos X días
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


@dashboard_router.get("/fraud_chart")
def get_fraud_chart(days: int = 7):
    driver = GraphDatabase.driver(
        "bolt://44.203.238.139:7687",
        auth=basic_auth("neo4j", "lieutenants-troubleshooters-freights")
    )
    query = f"""
        MATCH (a:Alerta)
        WHERE a.resuelta = false
          AND a.fecha_creacion >= datetime() - duration('P{days}D')
        RETURN date(a.fecha_creacion) AS fecha, count(a) AS total
        ORDER BY fecha
    """
    with driver.session(database="neo4j") as session:
        results = session.run(query)
        data = []
        for record in results:
            fecha = record["fecha"]
            data.append({"fecha": fecha.isoformat(), "total": record["total"]})
    return {"fraud_chart": data}

@dashboard_router.get("/transactions_chart")
def get_transactions_chart(days: int = 7):
    driver = GraphDatabase.driver(
        "bolt://44.203.238.139:7687",
        auth=basic_auth("neo4j", "lieutenants-troubleshooters-freights")
    )
    query = f"""
        MATCH (t:Transaccion)
        WHERE t.fecha_hora >= datetime() - duration('P{days}D')
        RETURN date(t.fecha_hora) AS fecha, count(t) AS total
        ORDER BY fecha
    """
    with driver.session(database="neo4j") as session:
        results = session.run(query)
        data = []
        for record in results:
            fecha = record["fecha"]
            data.append({"fecha": fecha.isoformat(), "total": record["total"]})
    return {"transactions_chart": data}
