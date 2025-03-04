from fastapi import APIRouter, HTTPException, Query
from neo4j import GraphDatabase, basic_auth

user_router = APIRouter()

DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

def get_db_session():
    """
    Crea y retorna una sesión con la base de datos Neo4j.
    """
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

def serialize_node(node):
    """
    Convierte un nodo de Neo4j a un diccionario.
    Si hay campos de fecha/datetime, se convierten a string ISO.
    """
    return {
        k: (v.isoformat() if hasattr(v, "isoformat") else v)
        for k, v in dict(node).items()
    }

@user_router.get("/user/details")
def get_user_details(nombre: str = Query(..., description="Nombre del cliente")):
    """
    Dado el nombre del usuario, retorna:
      - Datos del perfil (nombre, email, teléfono, etc.).
      - Datos de la cuenta (saldo, número de cuenta, etc.).
      - La última transacción realizada (ordenada por fecha DESC).
      - El historial completo de transacciones (ordenado por fecha DESC).
    
    Maneja los casos en que:
      - El cliente no exista (404).
      - El cliente exista pero no tenga cuenta asociada (404).
    """
    if not nombre:
        raise HTTPException(status_code=400, detail="Falta el parámetro 'nombre'.")
    
    with get_db_session() as session:
        # 1. Consultar el perfil del usuario y la cuenta asociada
        profile_query = """
            MATCH (c:Cliente {nombre: $nombre})
            OPTIONAL MATCH (c)-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            RETURN c AS user, cu AS account
        """
        result = session.run(profile_query, {"nombre": nombre})
        record = result.single()
        
        # Si no se encuentra un cliente
        if not record:
            raise HTTPException(status_code=404, detail="Cliente no encontrado.")
        
        user_node = record["user"]  # Nodo Cliente
        account_node = record["account"]  # Nodo Cuenta
        user_data = serialize_node(user_node)
        account_data = serialize_node(account_node) if account_node else None
        
        if not account_node:
            raise HTTPException(status_code=404, detail="El cliente no tiene cuenta asociada.")
        
        # 2. Obtener la última transacción (si existe)
        last_tx_query = """
            MATCH (c:Cliente {nombre: $nombre})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            RETURN tx
            ORDER BY tx.fecha_hora DESC
            LIMIT 1
        """
        last_tx_record = session.run(last_tx_query, {"nombre": nombre}).single()
        last_transaction = serialize_node(last_tx_record["tx"]) if last_tx_record else None
        
        # 3. Obtener el historial completo de transacciones
        tx_history_query = """
            MATCH (c:Cliente {nombre: $nombre})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            RETURN tx
            ORDER BY tx.fecha_hora DESC
        """
        tx_history_result = session.run(tx_history_query, {"nombre": nombre})
        transaction_history = [serialize_node(rec["tx"]) for rec in tx_history_result]
        
        return {
            "user": user_data,
            "account": account_data,
            "lastTransaction": last_transaction,
            "transactionHistory": transaction_history,
        }
    
@user_router.get("/user/transactions/full")
def get_user_transactions_full(nombre: str = Query(..., description="Nombre del cliente")):
    """
    Obtiene el historial de transacciones del usuario, asegurando que se muestra correctamente
    el nombre del destinatario en base a su número de cuenta.
    """
    if not nombre:
        raise HTTPException(status_code=400, detail="Falta el parámetro 'nombre'.")

    with get_db_session() as session:
        query = """
            MATCH (c:Cliente {nombre: $nombre})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            MATCH (destCuenta:Cuenta {numero_cuenta: tx.num_cuent_destino})
            OPTIONAL MATCH (destCliente)-[:CLIENTE_POSEE_CUENTA]->(destCuenta)
            RETURN tx, 
                   destCuenta.numero_cuenta AS cuenta_destino,
                   COALESCE(destCliente.nombre, 'Cuenta sin titular') AS destinatario
            ORDER BY tx.fecha_hora DESC
        """
        result = session.run(query, {"nombre": nombre})
        transactions = []

        for rec in result:
            tx_data = serialize_node(rec["tx"])
            tx_data["destinatario"] = rec["destinatario"]
            tx_data["cuenta_destino"] = rec["cuenta_destino"]
            transactions.append(tx_data)

        if not transactions:
            raise HTTPException(status_code=404, detail="No se encontraron transacciones para el cliente.")

        return {"transactions": transactions}
