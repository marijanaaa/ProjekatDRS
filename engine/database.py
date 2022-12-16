import pymongo
from pymongo import MongoClient

client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")

def get_db():
    db = client["cryptocurrency_db"]
    return db
    
db = get_db()