from enums import transaction_state
from app import transactionCollection,create_hash,userCollection
import time
import datetime

def transaction_processing(parametrs):
    user = userCollection.find_one({"email":parametrs["receiver_email"]})
    if user == None:
        transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': transaction_state.DENIED,'date':datetime.now()})
        return False

    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], parametrs["amount"])
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': transaction_state.PROCESSING,'date':datetime.now()})
    time.sleep(10)
    hash = create_hash(parametrs["sender_email"], parametrs["receiver_email"], parametrs["amount"])
    transactionCollection.insert_one({'hash':hash,'sender':parametrs["sender_email"],'receiver':parametrs["receiver_email"],
                               'cryptocurrency':parametrs["cryptocurrency"],'amount':parametrs["amount"],'state': transaction_state.PROCESSED,'date':datetime.now()})
    return True