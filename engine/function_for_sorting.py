from datetime import datetime

def sort_transactions_up(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)-1):
        for j in range(i+1,len(sorted_transaction)):
            if float(sorted_transaction[i]['amount'])>float(sorted_transaction[j]['amount']):
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

def sort_transactions_down(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)-1):
        for j in range(i+1,len(sorted_transaction)):
            if float(sorted_transaction[i]['amount'])<float(sorted_transaction[j]['amount']):
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

def sort_transaction_date_up(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)):
        for j in range(i+1,len(sorted_transaction)):
            if datetime.strptime(sorted_transaction[i]['date'],'%m/%d/%Y %H:%M:%S')> datetime.strptime(sorted_transaction[j]['date'],'%m/%d/%Y %H:%M:%S'):
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

def sort_transaction_date_down(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)):
        for j in range(i+1,len(sorted_transaction)):
            if datetime.strptime(sorted_transaction[i]['date'],'%m/%d/%Y %H:%M:%S')<datetime.strptime(sorted_transaction[j]['date'],'%m/%d/%Y %H:%M:%S'):
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

