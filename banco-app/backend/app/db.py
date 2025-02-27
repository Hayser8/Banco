from neo4j import GraphDatabase
from config import Config

class Database:
    def __init__(self):
        self.driver = GraphDatabase.driver(Config.NEO4J_URI, auth=(Config.NEO4J_USER, Config.NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def query(self, query, parameters={}):
        with self.driver.session() as session:
            return session.run(query, parameters)

db = Database()
