from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase, basic_auth
from admin.Dashboard.service import dashboard_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
driver = GraphDatabase.driver(
  "bolt://44.203.238.139:7687",
  auth=basic_auth("neo4j", "lieutenants-troubleshooters-freights")
)

@app.get("/transacciones")
def get_transacciones():
    cypher_query = """
    MATCH (t:Transaccion) 
    RETURN t.fecha_hora AS fecha, t.monto AS monto
    LIMIT 5000
    """
    with driver.session(database="neo4j") as session:
        results = session.run(cypher_query).data()
    return {"transacciones": results}


app.include_router(dashboard_router)
  
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
