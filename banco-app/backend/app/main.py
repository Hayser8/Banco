from neo4j import GraphDatabase, basic_auth

# Configurar la conexión a Neo4j
URI = "bolt://44.203.238.139:7687"
USER = "neo4j"
PASSWORD = "lieutenants-troubleshooters-freights"

driver = GraphDatabase.driver(URI, auth=basic_auth(USER, PASSWORD))

def test_connection():
    try:
        with driver.session(database="neo4j") as session:
            result = session.run("MATCH (n) RETURN COUNT(n) AS count LIMIT 10")
            for record in result:
                print(f"Nodos encontrados: {record['count']}")
        print("✅ Conexión exitosa a Neo4j")
    except Exception as e:
        print(f"❌ Error al conectar con Neo4j: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    test_connection()
