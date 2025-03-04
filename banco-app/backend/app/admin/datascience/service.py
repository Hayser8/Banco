from fastapi import APIRouter
from neo4j import GraphDatabase, basic_auth
from datetime import datetime

data_insights_router = APIRouter()

URI = "bolt://44.204.125.164"
AUTH = basic_auth("neo4j", "regrets-plates-break")

@data_insights_router.get("/data_insights/fraud_amount")
def get_fraud_by_amount():
    """
    Devuelve la distribución de fraudes por rango de montos.
    Ej.: 
      [ { "monto": "< $500", "fraudes": 10 }, ... ]
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            # Aquí asumimos que “fraude” es a.fraude_confirmado=true y 
            # “tx.monto” agrupa en rangos. Usamos CASE en Cypher.
            query = """
            MATCH (tx:Transaccion)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta)
            WHERE a.fraude_confirmado = true
            WITH tx,
            CASE 
              WHEN tx.monto < 500 THEN '< $500'
              WHEN tx.monto >= 500 AND tx.monto < 1000 THEN '$500 - $1000'
              WHEN tx.monto >= 1000 AND tx.monto < 5000 THEN '$1000 - $5000'
              ELSE '$5000+'
            END AS rango
            RETURN rango AS monto, count(*) AS fraudes
            ORDER BY monto
            """
            results = session.run(query)
            data = []
            for record in results:
                data.append({
                    "monto": record["monto"],
                    "fraudes": record["fraudes"]
                })
            return {"data": data}
    finally:
        driver.close()

@data_insights_router.get("/data_insights/fraud_day")
def get_fraud_by_day():
    """
    Devuelve la distribución de fraudes confirmados por día de la semana.
    Ej. [ { "dia": "Lun", "fraudes": 12 }, ... ]
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            # En Neo4j 4.x+ puedes usar date(tx.fecha_hora).weekday 
            # 0=Mon, 1=Tue, ...
            # Aquí lo convertimos a un string (puede requerir APOC).
            query = """
            MATCH (tx:Transaccion)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta)
            WHERE a.fraude_confirmado = true
            WITH tx, date(tx.fecha_hora).weekday AS wd
            RETURN
              CASE wd
                WHEN 0 THEN 'Lun'
                WHEN 1 THEN 'Mar'
                WHEN 2 THEN 'Mié'
                WHEN 3 THEN 'Jue'
                WHEN 4 THEN 'Vie'
                WHEN 5 THEN 'Sáb'
                WHEN 6 THEN 'Dom'
              END AS dia,
              count(*) AS fraudes
            ORDER BY wd
            """
            results = session.run(query)
            data = []
            for record in results:
                data.append({
                    "dia": record["dia"],
                    "fraudes": record["fraudes"]
                })
            return {"data": data}
    finally:
        driver.close()

@data_insights_router.get("/data_insights/risk_chart")
def get_risk_by_user():
    """
    Devuelve top 5 usuarios con mayor riesgo_acumulado (c.riesgo_acumulado).
    Ej. [ { "usuario": "User A", "riesgo": 90 }, ... ]
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            query = """
            MATCH (c:Cliente)
            RETURN c.nombre AS usuario, c.riesgo_acumulado AS riesgo
            ORDER BY riesgo DESC
            LIMIT 5
            """
            results = session.run(query)
            data = []
            for record in results:
                data.append({
                    "usuario": record["usuario"],
                    "riesgo": record["riesgo"]
                })
            return {"data": data}
    finally:
        driver.close()

@data_insights_router.get("/data_insights/insights_summary")
def get_insights_summary():
    """
    Devuelve un pequeño resumen:
      - Usuarios con alto riesgo (ej. riesgo_acumulado>80)
      - Fraudes detectados este mes
      - Riesgo promedio por usuario
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            # 1) Usuarios con alto riesgo
            q_alto_riesgo = """
            MATCH (c:Cliente)
            WHERE c.riesgo_acumulado > 80
            RETURN count(c) AS total
            """
            r1 = session.run(q_alto_riesgo).single()
            usuarios_alto_riesgo = r1["total"] if r1 else 0

            # 2) Fraudes detectados este mes
            # Comparamos date(tx.fecha_hora).month = date().month 
            # (y year igual)
            q_fraudes_mes = """
            MATCH (tx:Transaccion)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta)
            WHERE a.fraude_confirmado=true
              AND date(tx.fecha_hora).month = date().month
              AND date(tx.fecha_hora).year = date().year
            RETURN count(*) AS total
            """
            r2 = session.run(q_fraudes_mes).single()
            fraudes_este_mes = r2["total"] if r2 else 0

            # 3) Riesgo promedio
            q_riesgo_prom = """
            MATCH (c:Cliente)
            RETURN avg(c.riesgo_acumulado) AS promedio
            """
            r3 = session.run(q_riesgo_prom).single()
            riesgo_promedio = r3["promedio"] if r3 else 0

            return {
                "usuarios_alto_riesgo": usuarios_alto_riesgo,
                "fraudes_este_mes": fraudes_este_mes,
                "riesgo_promedio": round(riesgo_promedio, 2)
            }
    finally:
        driver.close()
