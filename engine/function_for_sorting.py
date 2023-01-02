
def sort_transactions_up(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)):
        for j in range(i+1,len(sorted_transaction)):
            if sorted_transaction[i]['amount']>sorted_transaction[j]['amount']:
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

def sort_transactions_down(transactions):
    sorted_transaction=transactions
    for i in range(0,len(sorted_transaction)):
        for j in range(i+1,len(sorted_transaction)):
            if sorted_transaction[i]['amount']<sorted_transaction[j]['amount']:
                pom=sorted_transaction[i]
                sorted_transaction[i]=sorted_transaction[j]
                sorted_transaction[j]=pom
    return sorted_transaction

