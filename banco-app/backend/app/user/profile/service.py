from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth
from pydantic import BaseModel

profile_router = APIRouter()

DB_URI = "bolt://44.204.125.164"
DB_USER = "neo4j"
DB_PASS = "regrets-plates-break"

def get_db_session():
    """
    Crea y retorna una sesión con la base de datos Neo4j.
    """
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

class ProfileUpdateRequest(BaseModel):
    current_email: str  # Correo actual del usuario (como identificador)
    nombre: str         # Nuevo nombre del usuario
    email: str          # Nuevo correo electrónico

@profile_router.put("/profile")
def update_profile(data: ProfileUpdateRequest):
    with get_db_session() as session:
        # Buscar el nodo del cliente por el correo actual
        query_find = """
            MATCH (c:Cliente {email: $current_email})
            RETURN c
        """
        result = session.run(query_find, {"current_email": data.current_email})
        record = result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")

        # Actualizar el nodo con el nuevo nombre y correo
        query_update = """
            MATCH (c:Cliente {email: $current_email})
            SET c.nombre = $nombre, c.email = $new_email
            RETURN c
        """
        session.run(query_update, {
            "current_email": data.current_email,
            "nombre": data.nombre,
            "new_email": data.email
        })

    return {"message": "Perfil actualizado con éxito."}
