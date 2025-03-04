from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase, basic_auth

# Crear el router para el login
login_router = APIRouter()

# Configuración de la conexión a Neo4j
DB_URI = "bolt://3.92.180.104:7687"
DB_USER = "neo4j"
DB_PASS = "prime-sponge-exhibit"

# Función para conectar a la base de datos
def get_db_session():
    driver = GraphDatabase.driver(DB_URI, auth=basic_auth(DB_USER, DB_PASS))
    return driver.session(database="neo4j")

# Ruta para manejar el inicio de sesión
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
            RETURN c.rol AS rol
        """
        result = session.run(query, {"nombre": nombre})
        record = result.single()

        if record:
            rol = record["rol"]
            if rol == "admin":
                return {"message": "Login exitoso", "redirect_to": "/admin"}
            elif rol == "user":
                return {"message": "Login exitoso", "redirect_to": "/user"}
            else:
                return {"message": "Rol desconocido", "redirect_to": "/"}
        else:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

