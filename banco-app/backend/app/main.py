from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase, basic_auth
from datetime import datetime
from admin.Dashboard.service import dashboard_router
from admin.historial.service import historial_router
from admin.alerts.service import alerts_router
from admin.alerts.alerts_generationservice import generate_alerts_router
from admin.alerts.notifications_todayservice import notifications_today_router
from admin.profile.service import profile_router
from admin.subir_csv.service import csv_router
from login.service import login_router
from user.service import user_router
from user.transactions.service import transaction_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URI = "bolt://18.206.140.55:7687"
AUTH = basic_auth("neo4j", "cards-attachment-workload")
driver = GraphDatabase.driver(URI, auth=AUTH)

@app.on_event("shutdown")
def shutdown_event():
    driver.close()



@app.get("/transacciones")
def get_transacciones():
    cypher_query = """
    MATCH (t:Transaccion)
    WHERE datetime(t.fecha_hora) >= datetime() - duration('P7D')
    RETURN t.fecha_hora AS fecha, t.monto AS monto
    """
    with driver.session(database="neo4j") as session:
        results = session.run(cypher_query).data()

    for record in results:
        if isinstance(record["fecha"], datetime): 
            record["fecha"] = record["fecha"].isoformat()
        else:  
            record["fecha"] = str(record["fecha"])



    return {"transacciones_ultima_semana": results}

app.include_router(dashboard_router)
app.include_router(historial_router)
app.include_router(alerts_router)
app.include_router(generate_alerts_router)     
app.include_router(notifications_today_router)
app.include_router(profile_router)
app.include_router(login_router)
app.include_router(user_router)
app.include_router(csv_router)
app.include_router(transaction_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
