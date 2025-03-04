from fastapi import APIRouter, HTTPException, Query
from neo4j import GraphDatabase, basic_auth

user_router = APIRouter()

DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

def get_db_session():
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

def serialize_node(node):
    return {
        k: (v.isoformat() if hasattr(v, "isoformat") else v)
        for k, v in dict(node).items()
    }

@user_router.get("/user/details")
def get_user_details(nombre: str = Query(..., description="Nombre del cliente")):
    if not nombre:
        raise HTTPException(status_code=400, detail="Falta el parámetro 'nombre'.")
    
    with get_db_session() as session:
        profile_query = """
            MATCH (c:Cliente {nombre: $nombre})
            OPTIONAL MATCH (c)-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            RETURN c AS user, cu AS account
        """
        result = session.run(profile_query, {"nombre": nombre})
        record = result.single()
        
        if not record:
            raise HTTPException(status_code=404, detail="Cliente no encontrado.")
        
        user_node = record["user"]  # Nodo Cliente
        account_node = record["account"]  # Nodo Cuenta
        user_data = serialize_node(user_node)
        account_data = serialize_node(account_node) if account_node else None
        
        if not account_node:
            raise HTTPException(status_code=404, detail="El cliente no tiene cuenta asociada.")
        
        last_tx_query = """
            MATCH (c:Cliente {nombre: $nombre})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion)
            RETURN tx
            ORDER BY tx.fecha_hora DESC
            LIMIT 1
        """
        last_tx_record = session.run(last_tx_query, {"nombre": nombre}).single()
        last_transaction = serialize_node(last_tx_record["tx"]) if last_tx_record else None
        
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
    if not nombre:
        raise HTTPException(status_code=400, detail="Falta el parámetro 'nombre'.")

    with get_db_session() as session:
        query = """
            MATCH (c:Cliente {nombre: $nombre})-[:CLIENTE_POSEE_CUENTA]->(cu:Cuenta)
            OPTIONAL MATCH (cu)-[:CUENTA_REALIZA_TRANSACCION]->(tx:Transaccion) 
            OPTIONAL MATCH (tx2:Transaccion {num_cuent_destino: cu.numero_cuenta})
            OPTIONAL MATCH (destCuenta:Cuenta {numero_cuenta: tx.num_cuent_destino})
            OPTIONAL MATCH (destCliente)-[:CLIENTE_POSEE_CUENTA]->(destCuenta)
            OPTIONAL MATCH (origenCuenta:Cuenta {numero_cuenta: tx2.num_cuent_origen})
            OPTIONAL MATCH (origenCliente)-[:CLIENTE_POSEE_CUENTA]->(origenCuenta)
            RETURN tx, 
                   destCuenta.numero_cuenta AS cuenta_destino,
                   COALESCE(destCliente.nombre, 'Cuenta sin titular') AS destinatario,
                   tx2, 
                   origenCuenta.numero_cuenta AS cuenta_origen,
                   COALESCE(origenCliente.nombre, 'Cuenta sin titular') AS remitente
        """
        result = session.run(query, {"nombre": nombre})
        transactions = []
        seen_transactions = set()  

        for rec in result:
            if rec["tx"]:
                tx_data = serialize_node(rec["tx"])
                tx_id = tx_data["id_transaccion"]  
                
                if tx_id not in seen_transactions:
                    tx_data["destinatario"] = rec["destinatario"]
                    tx_data["cuenta_destino"] = rec["cuenta_destino"]
                    tx_data["tipo"] = "Enviado"
                    transactions.append(tx_data)
                    seen_transactions.add(tx_id)

            if rec["tx2"]:
                tx_data = serialize_node(rec["tx2"])
                tx_id = tx_data["id_transaccion"]  

                if tx_id not in seen_transactions:
                    tx_data["remitente"] = rec["remitente"]
                    tx_data["cuenta_origen"] = rec["cuenta_origen"]
                    tx_data["tipo"] = "Recibido"
                    transactions.append(tx_data)
                    seen_transactions.add(tx_id)

        if not transactions:
            raise HTTPException(status_code=404, detail="No se encontraron transacciones para el cliente.")

        transactions.sort(key=lambda x: x["fecha_hora"], reverse=True)

        return {"transactions": transactions}