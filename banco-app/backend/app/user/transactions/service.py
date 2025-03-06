from fastapi import APIRouter, HTTPException, Depends
from neo4j import GraphDatabase, basic_auth
import uuid
from datetime import datetime
from pydantic import BaseModel

transaction_router = APIRouter()

DB_URI = "bolt://18.206.140.55:7687"
DB_USER = "neo4j"
DB_PASS = "cards-attachment-workload"

def get_db_session():
    """
    Crea y retorna una sesión con la base de datos Neo4j.
    """
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

class TransactionRequest(BaseModel):
    usuario: str 
    numeroCuentaDestino: str
    monto: float
    moneda: str
    concepto: str = ""

@transaction_router.post("/transactions")
def make_transaction(data: TransactionRequest):

    print(f"📥 Recibido: {data}") 

    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor a 0.")

    with get_db_session() as session:
        query_get_account = """
            MATCH (c:Cliente {nombre: $usuario})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            RETURN cu.numero_cuenta AS numeroCuentaOrigen, cu.saldo_actual AS saldo_origen
        """
        user_account = session.run(query_get_account, {"usuario": data.usuario}).single()

        if not user_account:
            raise HTTPException(status_code=404, detail="No se encontró una cuenta asociada al usuario autenticado.")

        numeroCuentaOrigen = user_account["numeroCuentaOrigen"]
        saldo_origen = user_account["saldo_origen"]


        query_check_destino = """
            MATCH (cu_destino:Cuenta {numero_cuenta: $numeroCuentaDestino})
            RETURN cu_destino.numero_cuenta AS cuenta_destino
        """
        destino = session.run(query_check_destino, {"numeroCuentaDestino": data.numeroCuentaDestino}).single()

        if not destino:
            raise HTTPException(status_code=404, detail="Cuenta destino no encontrada.")


        if saldo_origen < data.monto:
            raise HTTPException(status_code=400, detail="Saldo insuficiente en la cuenta de origen.")


        transaction_id = str(uuid.uuid4())
        fecha_hora_actual = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")


        create_transaction_query = """
            MATCH (cu_origen:Cuenta {numero_cuenta: $numeroCuentaOrigen}),
                  (cu_destino:Cuenta {numero_cuenta: $numeroCuentaDestino})
            CREATE (tx:Transaccion {
                id_transaccion: $id_transaccion,
                monto: $monto,
                fecha_hora: datetime($fecha_hora),
                tipo: "Transferencia",
                estado: "exitosa",
                num_cuent_origen: $numeroCuentaOrigen,
                num_cuent_destino: $numeroCuentaDestino,
                moneda: $moneda,
                concepto: $concepto
            })
            MERGE (cu_origen)-[:CUENTA_REALIZA_TRANSACCION]->(tx)
            MERGE (tx)-[:CUENTA_RECIBE_TRANSACCION]->(cu_destino)
        """
        session.run(create_transaction_query, {
            "id_transaccion": transaction_id,
            "monto": data.monto,
            "numeroCuentaOrigen": numeroCuentaOrigen,
            "numeroCuentaDestino": data.numeroCuentaDestino,
            "fecha_hora": fecha_hora_actual,
            "moneda": data.moneda,
            "concepto": data.concepto
        })

        update_balance_query = """
            MATCH (cu_origen:Cuenta {numero_cuenta: $numeroCuentaOrigen}),
                  (cu_destino:Cuenta {numero_cuenta: $numeroCuentaDestino})
            SET cu_origen.saldo_actual = cu_origen.saldo_actual - $monto,
                cu_destino.saldo_actual = cu_destino.saldo_actual + $monto
        """
        session.run(update_balance_query, {
            "numeroCuentaOrigen": numeroCuentaOrigen,
            "numeroCuentaDestino": data.numeroCuentaDestino,
            "monto": data.monto
        })

    return {
        "message": "Transacción realizada con éxito.",
        "id_transaccion": transaction_id,
        "monto": data.monto,
        "moneda": data.moneda,
        "concepto": data.concepto,
        "fecha_hora": fecha_hora_actual
    }
