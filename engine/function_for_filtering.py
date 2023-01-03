from datetime import datetime

def filtering_amount(min,max,transactions):
    filtered_transaction=[]
    for t in transactions:
        if t['amount']>min and t['amount']<max:
            filtered_transaction.append(t)
    return filtered_transaction

def filtering_datetime(date,transactions):
    filtered_transaction=[]
    for t in transactions:
        if t['date'].date()==date:
            filtered_transaction.append(t)
    return filtered_transaction
