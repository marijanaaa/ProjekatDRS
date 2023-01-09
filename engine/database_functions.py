from flask import json

def update_cryptocurrency(cryptocurrencyCollection,email, currency, coin_amount):
    result = cryptocurrencyCollection.find_one({"email":email})
    result = json.dumps(result, default=str)
    query={'email':email}
    new_value = {"$set":{currency:coin_amount}}
    result = cryptocurrencyCollection.update_one(query,new_value)
    return result

def increase_crypto(cryptocurrencyCollection,email,symbol,amount):
    result = cryptocurrencyCollection.find_one({"email":email})
    if result == None:
        obj = {'email':email,'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
        res = cryptocurrencyCollection.insert_one(obj)
        if res != None:
            return amount
        #provere fale
    result = json.dumps(result, default=str)
    result_dict = json.loads(result)
    print(symbol)
    print(result_dict[symbol])
    old_amount = float(result_dict[symbol])
    print(amount)
    print(result_dict[symbol])
    new_amount = old_amount + float(amount)
    print(new_amount)
    return new_amount

def decrease_crypto(cryptocurrencyCollection,email, symbol,amount):
    result = cryptocurrencyCollection.find_one({"email":email})
    result = json.dumps(result, default=str)
    result_dict = json.loads(result)
    old_amount = float(result_dict[symbol])
    new_amount = old_amount - float(amount)
    return new_amount

def insert_cryptocurrency(cryptocurrencyCollection,email, currency, coin_amount):
    obj = {'email':email,'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
    if currency == 'BTC':
        obj['BTC'] = coin_amount
    elif currency == 'ETH':
        obj['ETH'] = coin_amount
    elif currency == 'USDT':
        obj['USDT'] = coin_amount
    elif currency == 'BUSD':
        obj['BUSD'] = coin_amount
    elif currency == 'DOGE':
        obj['DOGE'] = coin_amount
    result = cryptocurrencyCollection.insert_one(obj)
    return result


def decrease_dollar_amount(cryptocurrencyCollection,email, amount_in_dollars):
    result = cryptocurrencyCollection.find_one({"email":email})
    result = json.dumps(result, default=str)
    result_dict = json.loads(result)
    old_amount = float(result_dict["dollars"])
    new_amount = old_amount - float(amount_in_dollars)
    #updating dollar amount
    query={'email':email}
    new_value = {"$set":{'dollars':new_amount}}
    result = cryptocurrencyCollection.update_one(query,new_value)
    if result.matched_count > 0:
        return "OK"
    return "ERROR"
