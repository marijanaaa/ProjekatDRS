from flask import Flask, jsonify, request,json,Blueprint
from database import db
from flask_jwt_extended import jwt_required
from cryptocurrency import get_assets_coin_cap_API,get_price,get_coins_from_dollars,exchange_cryptocurrency
from database_functions import *

userCollection = db["users"]
transactionCollection = db["transactions"]
cryptocurrencyCollection = db["cryptocurrencies"]
bp_exc = Blueprint('exchanges', __name__, url_prefix='/exchanges')

@bp_exc.route('/cardTransaction', methods=["POST"])
@jwt_required()
def card_transaction():
    email = request.get_json(force=True).get('email')
    amount_in_dollars = request.get_json(force=True).get('dollars')
    obj = {'email':email,'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
    obj['dollars'] = amount_in_dollars
    crypto_coll = cryptocurrencyCollection.find_one({'email':email})
    if crypto_coll == None:
        result = cryptocurrencyCollection.insert_one(obj)
        if result != None:
            return jsonify({'result':'OK'})
        return jsonify({'result':'ERROR'})
    #increasing dollar amount in collection
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
        return jsonify({"result":"OK"})
    return jsonify({"result":"ERROR"})

@bp_exc.route('/exchangecripto',methods=["POST"])
@jwt_required()
def exchange_cripto():
    email = request.get_json(force=True).get('email')
    symbol_from = request.get_json(force=True).get('symbolfrom')
    symbol_to = request.get_json(force=True).get('symbolto')
    amount=request.get_json(force=True).get('amount')
    obj=cryptocurrencyCollection.find_one({'email':email})
    obj = json.dumps(obj, default=str)
    obj = json.loads(obj)
    if float(obj[symbol_from])> float(amount):
        result=exchange_cryptocurrency(symbol_from,symbol_to,float(amount))
        update_symbol_from = update_cryptocurrency(cryptocurrencyCollection,email, symbol_from, decrease_crypto(cryptocurrencyCollection,email,symbol_from,float(amount)))
        update_symbol_to=update_cryptocurrency(cryptocurrencyCollection,email,symbol_to,increase_crypto(cryptocurrencyCollection,email,symbol_to,result))
        return jsonify({"result":"OK"})
    else:
        return jsonify({"result":"You don't have enough cryptocurrency for this exchange"})

    
@bp_exc.route('/exchangeDollarsToCrypto', methods=["POST"])
@jwt_required()
def exhange_dollars_to_crypto():
    #need to decrease amount in dollars when crypto currency is bought!
    email = request.get_json(force=True).get('email')
    amount_in_dollars = request.get_json(force=True).get('dollars')
    currency = request.get_json(force=True).get('currency')

    email_exists = cryptocurrencyCollection.find_one({'email':email})
    coin_amount = get_coins_from_dollars(amount_in_dollars, currency)
    #need to update old crypto amount adding new amount
    
    if email_exists == None:
        result = insert_cryptocurrency(cryptocurrencyCollection,email, currency, coin_amount, amount_in_dollars)
        res = json.dumps(email_exists, default=str)
        result_dict = json.loads(res)
        if float(result_dict["dollars"]) < float(amount_in_dollars):
            return jsonify({'result':'ERROR'})
        res = decrease_dollar_amount(cryptocurrencyCollection,email, amount_in_dollars)
        if result != None and res == "OK":
            return jsonify({'result':'OK'})
        return jsonify({'result':'ERROR'})
    res = json.dumps(email_exists, default=str)
    result_dict = json.loads(res)
    if float(result_dict["dollars"]) < float(amount_in_dollars):
        return jsonify({'result':'ERROR'})
    result = update_cryptocurrency(cryptocurrencyCollection,email, currency,increase_crypto(cryptocurrencyCollection,email,currency,coin_amount))
    res = decrease_dollar_amount(cryptocurrencyCollection,email, amount_in_dollars)
    if result.matched_count > 0 and res == "OK":
        return jsonify({"result":"OK"})
    return jsonify({"result":"ERROR"})
