from flask import Flask, jsonify, request,json,Blueprint
from database import db
from flask_jwt_extended import jwt_required
from cryptocurrency import get_assets_coin_cap_API,get_price,get_coins_from_dollars,exchange_cryptocurrency
from database_functions import *
import multiprocessing as mp
import transaction_class
from multiprocessing import Process
from flask_sock import Sock

queue_card=mp.Queue(maxsize=100)
queue_exccrypto=mp.Queue(maxsize=100)
queue_exc_dollar_crypto=mp.Queue(maxsize=100)
queue_verify=mp.Queue(maxsize=100)
userCollection = db["users"]
transactionCollection = db["transactions"]
cryptocurrencyCollection = db["cryptocurrencies"]
bp_exc = Blueprint('exchanges', __name__, url_prefix='/exchanges')
sockets=Sock(bp_exc)  

@bp_exc.route('/cardTransaction', methods=["POST"])
@jwt_required()
def card_transaction():
    email = request.get_json(force=True).get('email')
    amount_in_dollars = request.get_json(force=True).get('dollars')
    
    p=Process(target=transaction_class.card_transaction,args=(email,amount_in_dollars,queue_card))
    p.start()
    
    return jsonify({"result":"OK"})

@sockets.route("/cardTransactionSocket")
def verify_notification_card(sockets):
    result=queue_card.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(False) 

@bp_exc.route('/exchangecripto',methods=["POST"])
@jwt_required()
def exchange_cripto():
    email = request.get_json(force=True).get('email')
    symbol_from = request.get_json(force=True).get('symbolfrom')
    symbol_to = request.get_json(force=True).get('symbolto')
    amount=request.get_json(force=True).get('amount')
    p=Process(target=transaction_class.exchanges_between_crypto,args=(email,symbol_from,symbol_to,amount,queue_exccrypto))
    p.start()
    
    return jsonify({"result":"OK"})

@sockets.route("/cardCryptoSocket")
def verify_notification_crypto(sockets):
    result=queue_exccrypto.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(False)
    
@bp_exc.route('/exchangeDollarsToCrypto', methods=["POST"])
@jwt_required()
def exhange_dollars_to_crypto():
    #need to decrease amount in dollars when crypto currency is bought!
    email = request.get_json(force=True).get('email')
    amount_in_dollars = request.get_json(force=True).get('dollars')
    currency = request.get_json(force=True).get('currency')

    p=Process(target=transaction_class.exchange_dollar_to_crypto,args=(email,amount_in_dollars,currency,queue_exc_dollar_crypto))
    p.start()
    return jsonify({"result":"OK"})
    
@sockets.route("/DollarCryptoSocket")
def verify_notification_dollars(sockets):
    result=queue_exc_dollar_crypto.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(False)


@bp_exc.route('/verification', methods=["POST"])
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
    p=Process(target=transaction_class.verification_process,args=(number,name,year,month,day,security_code,email,queue_verify))
    p.start()
    return jsonify({"result":"OK"})

@sockets.route("/verificationUser")
def verify_notification_user(sockets):
    result=queue_verify.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(False)