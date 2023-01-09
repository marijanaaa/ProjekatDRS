from flask import Flask, jsonify, request,json
from database import db
from cryptocurrency import get_assets_coin_cap_API,get_price,get_coins_from_dollars,exchange_cryptocurrency
from card import verification
from datetime import datetime
from hash import create_hash
from enums import transaction_state
from flask_cors import CORS
import datetime
import jwt
from werkzeug.security import generate_password_hash,check_password_hash
from functools import wraps
import uuid
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import threading
from flask_sock import Sock
from function_for_sorting import sort_transactions_up, sort_transactions_down,sort_transaction_date_up,sort_transaction_date_down
from function_for_filtering import filtering_amount,filtering_datetime,filtering_by_email
from bson import json_util
from itertools import chain
from multiprocessing import Process
import multiprocessing as mp
import transaction_class
from database_functions import *

qu=mp.Queue(maxsize=100)

#collections
userCollection = db["users"]
transactionCollection = db["transactions"]
cryptocurrencyCollection = db["cryptocurrencies"]

app = Flask(__name__)
CORS(app)
sockets=Sock(app)
#sockets.init_app(app)
app.config["SECRET_KEY"] = "004f2af45d3a4e161a7dd2d17fdae47f"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
_jwt = JWTManager(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        print("BLABLABLA")
        exp_timestamp = get_jwt()["exp"]
        now = datetime.datetime.now(datetime.timezone.utc)
        target_timestamp = datetime.datetime.timestamp(now + datetime.timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/registration', methods=['POST'])
def user_registration():
    name = request.get_json(force=True).get('name')
    lastname = request.get_json(force=True).get('lastname')
    address = request.get_json(force=True).get('address')
    city = request.get_json(force=True).get('city')
    country= request.get_json(force=True).get('country')
    number = request.get_json(force=True).get('number')
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')
    hashed_password = generate_password_hash(password, method='sha256')
    result = userCollection.insert_one({'name':name,'lastname':lastname,'address':address,'city':city,
                                        'country':country,'number':number,'email':email,'password':hashed_password,
                                        'isVerified':False})
    if result != None:
        return jsonify({'result':'OK'})
    return jsonify({'result':'ERROR'}) 
    
@app.route('/login', methods=["POST"])
def user_login():
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')

    user = userCollection.find_one({"email":email})
    user = json.dumps(user, default=str) 
    dict_user = json.loads(user) 

    merged_dict = {} 
    if email != dict_user["email"]:
        return {"msg": "Wrong email"}, 401
    if check_password_hash(dict_user['password'], password):
        access_token = create_access_token(identity=email)
        json_string_token =  '{"token":"%s"}' % (access_token)
        dict_token = json.loads(json_string_token)
        
        dict_user["password"] = password
        merged_dict = {key: value for (key, value) in (list(dict_user.items()) + list(dict_token.items()))}
    return json.dumps(merged_dict, default=json)
    

@app.route('/edit', methods=["PUT"])
@jwt_required()
def edit_profile():
    name = request.get_json(force=True).get('name')
    lastname = request.get_json(force=True).get('lastname')
    address = request.get_json(force=True).get('address')
    city = request.get_json(force=True).get('city')
    country = request.get_json(force=True).get('country')
    number = request.get_json(force=True).get('number')
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')
    hashed_password = generate_password_hash(password, method='sha256')

    user = userCollection.find_one({"email":email})
    user = json.dumps(user, default=str)
    dict_user = json.loads(user)

    query={'email': email}
    new_values={"$set":{'name':name,'lastname':lastname,'address':address,'city':city,'country':country,
           'number':number,'email':email,'password':hashed_password}}
    
    result = userCollection.update_one(query,new_values)
    if result.matched_count > 0:
        return jsonify({"name": name, "lastname": lastname,
            "address":address, "city":city, "country":country,
            "number": number,"email":email,"password": password, 
            "isVerified": dict_user["isVerified"]})
    return jsonify({"result":"ERROR"})


@app.route('/verification', methods=["POST"])
@jwt_required()
def user_verification():
    email = request.get_json(force=True).get('email')
    number = request.get_json(force=True).get('number')
    name = request.get_json(force=True).get('name')
    expiration_date = request.get_json(force=True).get('expiration_date')
    list = expiration_date.split('-')
    year = list[0]
    month = list[1]
    day = list[2]
    security_code = request.get_json(force=True).get('security_code')
    isVerified = verification(number, name, year, month, day, security_code)
    if(isVerified == True):
        query={'email':email}
        new_value = {"$set":{'isVerfied':True}}
        result = userCollection.update_one(query,new_value)
        if result.matched_count > 0:
            return jsonify({"result":"OK"})
    return jsonify({"result":"ERROR"})

@app.route('/cardTransaction', methods=["POST"])
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

@app.route('/exchangecripto',methods=["POST"])
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

    
@app.route('/exchangeDollarsToCrypto', methods=["POST"])
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

@app.route('/getAccountBalance',methods=["POST"] )
@jwt_required()
def get_account_balance():
    email = request.get_json(force=True).get('email')
    account_balance = cryptocurrencyCollection.find_one({"email":email})
    if account_balance != None: 
        return json.dumps(account_balance, default=str)
    obj = {'email':email,'dollars':0,'BTC':0,'ETH':0,'USDT':0,'BUSD':0,'DOGE':0}
    result = cryptocurrencyCollection.insert_one(obj)#if in collection doesnt exist that email we should return 
    #initial object with all zeros
    if result != None:
        return json.dumps(obj, default=str)
    return jsonify({'result':'ERROR'})


def Merge(dict1, dict2):
    return(dict2.update(dict1))

@app.route('/getTransactions', methods=["POST"])
@jwt_required()
def get_transactions():
    email = request.get_json(force=True).get('email')
    sender_cursor = transactionCollection.find({"sender": email})
    receiver_cursor = transactionCollection.find({"receiver": email})
    union_cursor = chain(sender_cursor, receiver_cursor)
    json_docs = []
    for doc in union_cursor:
        json_doc = json.loads(json_util.dumps(doc))
        del json_doc['_id']
        del json_doc['hash']
        json_docs.append(json_doc)
    return json.dumps(json_docs, default=json_util.default)
    #return jsonify({"result":json_string})
    

@app.route('/sortTransactions', methods=["POST"])
@jwt_required()
def sort_transactions():
    factor = request.get_json(force=True).get('factor')
    value = request.get_json(force=True).get('value')
    email = request.get_json(force=True).get('email')
    sender_cursor = transactionCollection.find({"sender": email})
    receiver_cursor = transactionCollection.find({"receiver": email})
    union_cursor = chain(sender_cursor, receiver_cursor)  
    json_docs = []
    for doc in union_cursor:
        json_doc = json.loads(json_util.dumps(doc))
        del json_doc['_id']
        del json_doc['hash']
        json_docs.append(json_doc)
        print(json_doc)
    if value=="Ascending" and factor=="Amount":
        result=sort_transactions_up(json_docs)
    elif value=="Descending" and factor=="Amount":
        result=sort_transactions_down(json_docs)
    elif value=="Ascending" and factor=="Date":
        result=sort_transaction_date_up(json_docs)
    else:
        result=sort_transaction_date_down(json_docs)   
    return json.dumps(result, default=json_util.default)

@app.route('/filterTransactions', methods=["POST"])
@jwt_required()
def filter_transactions():
    email = request.get_json(force=True).get('email')
    date = request.get_json(force=True).get('date')
    recvEmail = request.get_json(force=True).get('recvEmail')
    min=request.get_json(force=True).get('min')
    max=request.get_json(force=True).get('max')
    sender_cursor = transactionCollection.find({"sender": email})
    receiver_cursor = transactionCollection.find({"receiver": email})
    union_cursor = chain(sender_cursor, receiver_cursor)
    json_docs = []
    for doc in union_cursor:
        json_doc = json.loads(json_util.dumps(doc))
        del json_doc['_id']
        del json_doc['hash']
        json_docs.append(json_doc)
    if date != None:
        result=filtering_datetime(date,json_docs)
    elif recvEmail!=None:
        result=filtering_by_email(recvEmail,json_docs)
    else :
        min=float(min)
        max=float(max)
        result=filtering_amount(min,max,json_docs)
    return json.dumps(result, default=json_util.default)


@app.route('/newTransaction',methods=["POST"])
@jwt_required()
def new_transaction():
    sender_email = request.get_json(force=True).get('sender_email')
    receiver_email = request.get_json(force=True).get('receiver_email')
    amount = request.get_json(force=True).get('amount')
    cryptocurrency = request.get_json(force=True).get('cryptocurrency')
    parametrs={"sender_email":sender_email,"receiver_email":receiver_email,"amount":amount,"cryptocurrency":cryptocurrency}
    p=Process(target=transaction_class.transaction_processing,args=(parametrs,qu))
    p.start()
    
    return jsonify({"result":"OK"})



@sockets.route("/verifysocket")
def verify_notification(sockets):
    result=qu.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(True)
        

if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)
