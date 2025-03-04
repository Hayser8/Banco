from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth

# Crear el router para el perfil
profile_router = APIRouter(tags=["Perfil"])

# Configuración de la conexión a Neo4j
DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

def get_db_session():
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

# Obtener información del perfil
@profile_router.get("/perfil")
def get_profile(nombre: str):
    """
    Obtiene la información del perfil de un usuario por su nombre.
    """
    with get_db_session() as session:
        query = """
            MATCH (c:Cliente {nombre: $nombre})
            RETURN c.nombre AS nombre, c.email AS email, c.rol AS rol
        """
        result = session.run(query, {"nombre": nombre})
        record = result.single()

        if record:
            return {
                "nombre": record["nombre"],
                "email": record.get("email", "No registrado"),
                "rol": record["rol"]
            }
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

# Actualizar información del perfil
@profile_router.put("/perfil")
def update_profile(nombre: str, email: str):
    """
    Actualiza el correo electrónico del usuario.
    """
    with get_db_session() as session:
        query = """
            MATCH (c:Cliente {nombre: $nombre})
            SET c.email = $email
            RETURN c.nombre AS nombre, c.email AS email, c.rol AS rol
        """
        result = session.run(query, {"nombre": nombre, "email": email})
        record = result.single()

        if record:
            return {
                "nombre": record["nombre"],
                "email": record["email"],
                "rol": record["rol"]
            }
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
