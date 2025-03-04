from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth

login_router = APIRouter()


DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

def get_db_session():
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

@login_router.get("/login")
def login_cliente(nombre: str):
    """
    Busca al cliente en la base de datos y determina su rol.
    Si el cliente es admin, redirige a /admin.
    Si el cliente es usuario normal, redirige a /user.
    Si el cliente no existe, retorna un error 404.
    """
    with get_db_session() as session:
        query = """
            MATCH (c:Cliente {nombre: $nombre})
            RETURN c.nombre AS usuario, c.rol AS rol
        """
        result = session.run(query, {"nombre": nombre})
        record = result.single()

        if record:
            usuario = record["usuario"]
            rol = record["rol"]
            redirect_to = "/admin" if rol == "admin" else "/user"
            return {
                "message": "Login exitoso",
                "redirect_to": redirect_to,
                "usuario": usuario,  
                "rol": rol  
            }
        else:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

