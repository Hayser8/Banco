from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth
from pydantic import BaseModel
from datetime import datetime

transactions_router = APIRouter()

# Configuración de conexión a Neo4j
URI = "bolt://3.92.180.104:7687"
AUTH = basic_auth("neo4j", "prime-sponge-exhibit")

# Modelo de datos para la transacción
class Transaction(BaseModel):
    usuario: str
    destinatario: str
    numeroCuenta: str
    alias: str = None
    tipoCuenta: str
    moneda: str
    monto: float
    concepto: str = None
    pais: str

@transactions_router.post("/transactions")
def create_transaction(transaction: Transaction):
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            # Verificar si la cuenta del destinatario existe
            cuenta_destino = session.run(
                "MATCH (c:Cuenta {numero: $numeroCuenta}) RETURN c",
                numeroCuenta=transaction.numeroCuenta
            ).single()

            if not cuenta_destino:
                raise HTTPException(status_code=404, detail="Cuenta no encontrada")

            # Insertar la transacción en la base de datos
            session.run(
                """
                MATCH (u:Cliente {nombre: $usuario})
                MATCH (c:Cuenta {numero: $numeroCuenta})
                CREATE (t:Transaccion {
                    id_transaccion: apoc.create.uuid(),
                    usuario: $usuario,
                    destinatario: $destinatario,
                    numeroCuenta: $numeroCuenta,
                    alias: $alias,
                    tipoCuenta: $tipoCuenta,
                    moneda: $moneda,
                    monto: $monto,
                    concepto: $concepto,
                    pais: $pais,
                    fecha_hora: datetime()
                })
                MERGE (u)-[:REALIZÓ]->(t)
                MERGE (t)-[:DESTINO]->(c)
                """,
                usuario=transaction.usuario,
                destinatario=transaction.destinatario,
                numeroCuenta=transaction.numeroCuenta,
                alias=transaction.alias,
                tipoCuenta=transaction.tipoCuenta,
                moneda=transaction.moneda,
                monto=transaction.monto,
                concepto=transaction.concepto,
                pais=transaction.pais
            )
        return {"message": "Transacción registrada exitosamente"}
    finally:
        driver.close()

@transactions_router.get("/transactions/{usuario}")
def get_user_transactions(usuario: str, limit: int = 5):
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        with driver.session(database="neo4j") as session:
            results = session.run(
                """
                MATCH (c:Cliente {nombre: $usuario})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
                MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(t:Transaccion)
                OPTIONAL MATCH (t)-[:DESTINO]->(cu_destino:Cuenta)
                OPTIONAL MATCH (cliente_destino:Cliente)-[:CLIENTE_POSEE_CUENTA]->(cu_destino)
                RETURN t.id_transaccion AS id_transaccion, 
                       COALESCE(cliente_destino.nombre, cu_destino.numero, t.destinatario) AS destinatario, 
                       t.monto AS monto, 
                       t.moneda AS moneda, 
                       t.fecha_hora AS fecha
                ORDER BY t.fecha_hora DESC
                LIMIT $limit
                """,
                usuario=usuario,
                limit=limit
            )
            transactions = [
                {
                    "id_transaccion": record["id_transaccion"],
                    "destinatario": record["destinatario"] or "Desconocido",
                    "monto": record["monto"],
                    "moneda": record["moneda"],
                    "fecha": record["fecha"].isoformat()
                }
                for record in results
            ]
        return {"transactions": transactions}
    finally:
        driver.close()

