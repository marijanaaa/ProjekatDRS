
def filtering_amount(min,max,transactions):
    filtered_transaction=[]
    for t in transactions:
        if t['amount']>min and t['amount']<max:
            filtered_transaction.append(t)
    return filtered_transaction
