from enums import transaction_state
from app import transactionCollection,create_hash,userCollection,cryptocurrencyCollection,update_cryptocurrency,decrease_crypto,increase_crypto
import pytz
import time
from datetime import datetime

def transaction_processing(parametrs):
    user = userCollection.find_one({"email":parametrs["receiver_email"]})
    if user == None:
        hash=create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        return False

    result = cryptocurrencyCollection.find_one({"email":parametrs["sender_email"]})
    if float(result[parametrs["cryptocurrency"]])<float(parametrs["amount"]):
        hash=create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'DENIED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
        return False
    
    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'PROCESSING',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    
    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], str(parametrs["amount"]))
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': 'PROCESSED',
                               'date':datetime.now(tz=pytz.UTC).strftime("%m/%d/%Y %H:%M:%S")})
    
    res=update_cryptocurrency(parametrs["sender_email"],parametrs["cryptocurrency"],decrease_crypto(parametrs["sender_email"],parametrs["cryptocurrency"],parametrs["amount"]))
    res=update_cryptocurrency(parametrs["receiver_email"],parametrs["cryptocurrency"],increase_crypto(parametrs["receiver_email"],parametrs["cryptocurrency"],parametrs["amount"]))

    return True