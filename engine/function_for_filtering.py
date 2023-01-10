from datetime import datetime

def filtering_amount(min,max,transactions):
    filtered_transaction=[]
    for t in transactions:
        if float(t['amount'])>min and float(t['amount'])<max:
            filtered_transaction.append(t)
    return filtered_transaction

def filtering_datetime(date,transactions):
    date_transformed=datetime.strptime(date+" 00:00:00",'%Y-%m-%d %H:%M:%S').date()
    filtered_transaction=[]
    for t in transactions:
        date_transaction=datetime.strptime(t['date'],'%m/%d/%Y %H:%M:%S').date()
        if  date_transaction==date_transformed:
            filtered_transaction.append(t)
    return filtered_transaction

def filtering_by_email(email,transactions):
    filtered_transaction=[]
    for t in transactions:
        if email in t['sender'] or email in t['receiver']:
            filtered_transaction.append(t)
    return filtered_transaction