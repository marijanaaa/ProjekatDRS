from hash import create_hash
import pytz
import time
from datetime import datetime
import pymongo
from pymongo import MongoClient
from flask import json
from database_functions import *

def transaction_processing(parametrs,q):  
    time.sleep(20)
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["cryptocurrency_db"]
    userCollection = db["users"]
    transactionCollection = db["transactions"]
    cryptocurrencyCollection = db["cryptocurrencies"]
    user = userCollection.find_one({"email":parametrs["receiver_email"]})
    if user == None:
        hash=create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        q.push("denied")

    result = cryptocurrencyCollection.find_one({"email":parametrs["sender_email"]})
    if float(result[parametrs["cryptocurrency"]])<float(parametrs["amount"]):
        hash=create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        q.push("denied")

    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})

    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})

    update_cryptocurrency(cryptocurrencyCollection,parametrs["sender_email"],parametrs["cryptocurrency"],decrease_crypto(cryptocurrencyCollection,parametrs["sender_email"],parametrs["cryptocurrency"],parametrs["amount"]))
    update_cryptocurrency(cryptocurrencyCollection,parametrs["receiver_email"],parametrs["cryptocurrency"],increase_crypto(cryptocurrencyCollection,parametrs["receiver_email"],parametrs["cryptocurrency"],parametrs["amount"]))
    q.put("success")

