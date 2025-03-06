from fastapi import APIRouter,HTTPException
from neo4j import GraphDatabase, basic_auth

generate_alerts_router = APIRouter()

URI = "bolt://18.206.140.55:7687"
AUTH = basic_auth("neo4j", "cards-attachment-workload")

@generate_alerts_router.post("/alerts/generate")
def generate_alerts():
    """
    Genera alertas según 5 reglas, sin almacenar promedios/países usuales:
      1) La cuenta queda con saldo 0 (cu.saldo_actual=0).
      2) Transacción mayor al saldo (intento de gastar más de lo que hay).
      3) Transacción > 120% del promedio de las últimas 10 transacciones
         (calculado al vuelo).
      4) País destino no visto en transacciones anteriores de la misma cuenta.
      5) 3 transacciones en <= 1 hora.
    """
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session() as session:
            # 1) Cuenta vaciada
            q1 = """
            MATCH (cu:Cuenta)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WHERE cu.saldo_actual = 0
              AND NOT EXISTS {
                MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {descripcion:"Cuenta vaciada"})
              }
            CREATE (a:Alerta {
              id_alerta: apoc.create.uuid(),
              descripcion:"Cuenta vaciada",
              fecha_creacion: datetime(),
              nivel_severidad:7,
              resuelta:false,
              fraude_confirmado:false,
              vista:false
            })
            MERGE (tx)-[:TRANSACCION_GENERA_ALERTA]->(a)
            """
            session.run(q1)

            # 2) Gasto mayor al saldo
            q2 = """
            MATCH (cu:Cuenta)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WHERE tx.monto > cu.saldo_actual
              AND NOT EXISTS {
                MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {descripcion:"Intento gastar saldo inexistente"})
              }
            CREATE (a:Alerta {
              id_alerta: apoc.create.uuid(),
              descripcion:"Intento gastar saldo inexistente",
              fecha_creacion: datetime(),
              nivel_severidad:6,
              resuelta:false,
              fraude_confirmado:false,
              vista:false
            })
            MERGE (tx)-[:TRANSACCION_GENERA_ALERTA]->(a)
            """
            session.run(q2)

            # 3) Monto > 120% del promedio ultimas 10 trans
            q3 = """
            MATCH (cu:Cuenta)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WITH cu, tx,
              [ tr in [(cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx2:Transaccion) | tx2.monto ] 
                WHERE tr IS NOT NULL][0..10] AS ultimos
            WITH cu, tx, apoc.agg.avg(ultimos) AS avgVal
            WHERE tx.monto > (avgVal * 1.2)
              AND NOT EXISTS {
                MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {descripcion:"Monto 20% sobre promedio"})
              }
            CREATE (a:Alerta {
              id_alerta: apoc.create.uuid(),
              descripcion:"Monto 20% sobre promedio",
              fecha_creacion: datetime(),
              nivel_severidad:5,
              resuelta:false,
              fraude_confirmado:false,
              vista:false
            })
            MERGE (tx)-[:TRANSACCION_GENERA_ALERTA]->(a)
            """
            session.run(q3)

            # 4) Pais destino no visto
            q4 = """
            MATCH (cu:Cuenta)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WHERE NOT tx.pais_destino IN 
              [ tr2 in [(cu)-[:CUENTA_REALIZA_TRANSACCION]->(t2:Transaccion) | t2.pais_destino ] WHERE tr2 IS NOT NULL ]
              AND NOT EXISTS {
                MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {descripcion:"Pais destino desconocido"})
              }
            CREATE (a:Alerta {
              id_alerta: apoc.create.uuid(),
              descripcion:"Pais destino desconocido",
              fecha_creacion: datetime(),
              nivel_severidad:4,
              resuelta:false,
              fraude_confirmado:false,
              vista:false
            })
            MERGE (tx)-[:TRANSACCION_GENERA_ALERTA]->(a)
            """
            session.run(q4)

            # 5) 3+ trans en <=1h
            q5 = """
            MATCH (cu:Cuenta)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            WITH cu, tx
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx2:Transaccion)
            WHERE tx2.fecha_hora >= tx.fecha_hora - duration('PT1H')
              AND tx2.fecha_hora <= tx.fecha_hora
            WITH tx, count(tx2) AS c
            WHERE c >= 3
              AND NOT EXISTS {
                MATCH (tx)-[:TRANSACCION_GENERA_ALERTA]->(a:Alerta {descripcion:"3 trans en 1 hora"})
              }
            CREATE (a:Alerta {
              id_alerta: apoc.create.uuid(),
              descripcion:"3 trans en 1 hora",
              fecha_creacion: datetime(),
              nivel_severidad:5,
              resuelta:false,
              fraude_confirmado:false,
              vista:false
            })
            MERGE (tx)-[:TRANSACCION_GENERA_ALERTA]->(a)
            """
            session.run(q5)

        return {"detail": "Se generaron alertas con base en reglas."}
    finally:
        driver.close()
