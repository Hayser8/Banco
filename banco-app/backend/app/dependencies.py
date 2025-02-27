from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from neo4j import GraphDatabase
from config import Config
from db import db

# Configuración de autenticación con OAuth2 (para futuros endpoints protegidos)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    """
    Retorna una instancia de la base de datos para ser usada como dependencia en los endpoints.
    """
    return db

def get_current_user(token: str = Security(oauth2_scheme)):
    """
    Simulación de autenticación con JWT. Retornará un usuario si el token es válido.
    En el futuro, esto se integrará con autenticación real.
    """
    if token != "testtoken":  
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return {"username": "test_user"}

