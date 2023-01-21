from hash import create_hash
import pytz
import time
from datetime import datetime
import pymongo
from pymongo import MongoClient
from flask import json
from database_functions import *
from cryptocurrency import get_assets_coin_cap_API,get_price,get_coins_from_dollars,exchange_cryptocurrency
from card import verification

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
        q.put("denied")

    result = cryptocurrencyCollection.find_one({"email":parametrs["sender_email"]})
    if float(result[parametrs["cryptocurrency"]])<float(parametrs["amount"]):
        hash=create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        q.put("denied")

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

def card_transaction(email,amount_in_dollars,queue):
    time.sleep(20)
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["cryptocurrency_db"]
    
    transactionCollection = db["transactions"]
    cryptocurrencyCollection = db["cryptocurrencies"]
    obj = {'email':email,'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
    obj['dollars'] = amount_in_dollars
    crypto_coll = cryptocurrencyCollection.find_one({'email':email})
    success_transaction=False;
    if crypto_coll == None:
        result = cryptocurrencyCollection.insert_one(obj)
        if result != None:
            hash=create_hash(email, email, str(amount_in_dollars))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':"",'amount':amount_in_dollars,'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
            success_transaction=True
        else:
            queue.put("denied")
            hash=create_hash(email, email, str(amount_in_dollars))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                                'cryptocurrency':"",'amount':amount_in_dollars,'state': 'DENIED',
                                'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    else:
        hash=create_hash(email, email, str(amount_in_dollars))
        transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':"",'amount':amount_in_dollars,'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        success_transaction=True
    #increasing dollar amount in collection
    if(success_transaction):
        result = cryptocurrencyCollection.find_one({"email":email})
        result = json.dumps(result, default=str)
        result_dict = json.loads(result)
        old_amount = float(result_dict["dollars"])
        new_amount = float(amount_in_dollars) + old_amount
        #updating dollar amount
        query={'email':email}
        new_value = {"$set":{'dollars':new_amount}}
        result = cryptocurrencyCollection.update_one(query,new_value)
        if result.matched_count > 0:
            queue.put("success")
            hash=create_hash(email, email, str(amount_in_dollars))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':"",'amount':amount_in_dollars,'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        else:
            queue.put("denied")
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':"",'amount':amount_in_dollars,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})

            
def exchanges_between_crypto(email,symbol_from,symbol_to,amount,queue):
    time.sleep(20)
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["cryptocurrency_db"]
    
    transactionCollection = db["transactions"]
    cryptocurrencyCollection = db["cryptocurrencies"]
    obj=cryptocurrencyCollection.find_one({'email':email})
    obj = json.dumps(obj, default=str)
    obj = json.loads(obj)
    hash=create_hash(email, email, str(amount))
    transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':symbol_from,'cryptocurrency_to':symbol_to,'amount':amount,'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    if float(obj[symbol_from])> float(amount):
        result=exchange_cryptocurrency(symbol_from,symbol_to,float(amount))
        update_symbol_from = update_cryptocurrency(cryptocurrencyCollection,email, symbol_from, decrease_crypto(cryptocurrencyCollection,email,symbol_from,float(amount)))
        update_symbol_to=update_cryptocurrency(cryptocurrencyCollection,email,symbol_to,increase_crypto(cryptocurrencyCollection,email,symbol_to,result))
        queue.put("success")
        hash=create_hash(email, email, str(amount))
        transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':symbol_from,'cryptocurrency_to':symbol_to,'amount':amount,'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    else:
        queue.put("denied")
        hash=create_hash(email, email, str(amount))
        transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':symbol_from,'cryptocurrency_to':symbol_to,'amount':amount,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    
def exchange_dollar_to_crypto(email,amount_in_dollars,currency,queue):
    time.sleep(20)
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["cryptocurrency_db"]
    
    transactionCollection = db["transactions"]
    cryptocurrencyCollection = db["cryptocurrencies"]
    email_exists = cryptocurrencyCollection.find_one({'email':email})
    coin_amount = get_coins_from_dollars(amount_in_dollars, currency)
    #need to update old crypto amount adding new amount
    hash=create_hash(email, email, str(amount_in_dollars))
    transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':currency,'amount':amount_in_dollars,'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    succes_decrease=True
    if email_exists == None:
        result = insert_cryptocurrency(cryptocurrencyCollection,email, currency, coin_amount, amount_in_dollars)
        res = json.dumps(email_exists, default=str)
        result_dict = json.loads(res)
        if float(result_dict["dollars"]) < float(amount_in_dollars):
            succes_decrease=False
        else:
            res = decrease_dollar_amount(cryptocurrencyCollection,email, amount_in_dollars)
        if result != None and res == "OK":
            succes_decrease=True
        else:
            succes_decrease=False
            
    if succes_decrease:
        done_exchange=True
        res = json.dumps(email_exists, default=str)
        result_dict = json.loads(res)
        if float(result_dict["dollars"]) < float(amount_in_dollars):
            queue.put("denied")
            hash=create_hash(email, email, str(amount_in_dollars))
            done_exchange=False
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':currency,'amount':amount_in_dollars,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        else:
            result = update_cryptocurrency(cryptocurrencyCollection,email, currency,increase_crypto(cryptocurrencyCollection,email,currency,coin_amount))
            res = decrease_dollar_amount(cryptocurrencyCollection,email, amount_in_dollars)
        if result.matched_count > 0 and res == "OK" and done_exchange:
            queue.put("success")
            hash=create_hash(email, email, str(amount_in_dollars))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':currency,'amount':amount_in_dollars,'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        else:
            queue.put("denied")
            hash=create_hash(email, email, str(amount_in_dollars))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                                'cryptocurrency':currency,'amount':amount_in_dollars,'state': 'DENIED',
                                'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    else:
        queue.put("denied")
        hash=create_hash(email, email, str(amount_in_dollars))
        transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'cryptocurrency':currency,'amount':amount_in_dollars,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
            
def verification_process(number,name,year,month,day,security_code,email,queue_verify):
    time.sleep(20)
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["cryptocurrency_db"]
    userCollection = db["users"]
    transactionCollection = db["transactions"]
    isVerified = verification(number, name, year, month, day, security_code)
    hash=create_hash(email, email, str(1))
    transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'amount':1,'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    if(isVerified == True):
        query={'email':email}
        new_value = {"$set":{'isVerfied':True}}
        result = userCollection.update_one(query,new_value)
        if result.matched_count > 0:
            queue_verify.put("success")
            hash=create_hash(email, email, str(1))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'amount':1,'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        else:
            queue_verify.put("denied")
            hash=create_hash(email, email, str(1))
            transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'amount':1,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    else:
        queue_verify.put("denied")
        hash=create_hash(email, email, str(1))
        transactionCollection.insert_one({'hash':hash,'sender':email,'receiver':"",
                               'amount':1,'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})