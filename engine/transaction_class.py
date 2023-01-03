from enums import transaction_state
from app import transactionCollection,create_hash,userCollection,cryptocurrencyCollection,update_cryptocurrency,decrease_crypto,increase_crypto
import time
from datetime import datetime

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
    
    #obj = {'email':parametrs["receiver_email"],'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
    update_cryptocurrency(parametrs["sender_email"],parametrs["cryptocurrency"],decrease_crypto(parametrs["sender_email"],parametrs["cryptocurrency"],parametrs["amount"]))
    update_cryptocurrency(parametrs["receiver_email"],parametrs["cryptocurrency"],increase_crypto(parametrs["receiver_email"],parametrs["cryptocurrency"],parametrs["amount"]))
    return True