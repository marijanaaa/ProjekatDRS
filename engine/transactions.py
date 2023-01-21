from flask import jsonify, Blueprint,request,json
from flask_jwt_extended import jwt_required
from multiprocessing import Process
import multiprocessing as mp
import transaction_class
from flask_sock import Sock
from function_for_sorting import sort_transactions_up, sort_transactions_down,sort_transaction_date_up,sort_transaction_date_down
from function_for_filtering import filtering_amount,filtering_datetime,filtering_by_email
from bson import json_util
from itertools import chain
import pymongo
from pymongo import MongoClient
from database import db

qu=mp.Queue(maxsize=100)
bp = Blueprint('transactions', __name__, url_prefix='/transactions')
sockets=Sock(bp)  

transactionCollection = db["transactions"]

@bp.route('/newTransaction',methods=["POST"])
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



@bp.route('/getTransactions', methods=["POST"])
@jwt_required()
def get_transactions():
    email = request.get_json(force=True).get('email')
    sender_cursor = transactionCollection.find({"sender": email,'state': 'PROCESSED'})
    receiver_cursor = transactionCollection.find({"receiver": email,'state': 'PROCESSED'})
    union_cursor = chain(sender_cursor, receiver_cursor)
    json_docs = []
    for doc in union_cursor:
        json_doc = json.loads(json_util.dumps(doc))
        del json_doc['_id']
        del json_doc['hash']
        json_docs.append(json_doc)
    return json.dumps(json_docs, default=json_util.default)
    #return jsonify({"result":json_string})
    

@bp.route('/sortTransactions', methods=["POST"])
@jwt_required()
def sort_transactions():
    factor = request.get_json(force=True).get('factor')
    value = request.get_json(force=True).get('value')
    email = request.get_json(force=True).get('email')
    sender_cursor = transactionCollection.find({"sender": email,'state': 'PROCESSED'})
    receiver_cursor = transactionCollection.find({"receiver": email,'state': 'PROCESSED'})
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

@bp.route('/filterTransactions', methods=["POST"])
@jwt_required()
def filter_transactions():
    email = request.get_json(force=True).get('email')
    date = request.get_json(force=True).get('date')
    recvEmail = request.get_json(force=True).get('recvEmail')
    min=request.get_json(force=True).get('min')
    max=request.get_json(force=True).get('max')
    sender_cursor = transactionCollection.find({"sender": email,'state': 'PROCESSED'})
    receiver_cursor = transactionCollection.find({"receiver": email,'state': 'PROCESSED'})
    union_cursor = chain(sender_cursor, receiver_cursor)
    json_docs = []
    for doc in union_cursor:
        json_doc = json.loads(json_util.dumps(doc))
        del json_doc['_id']
        del json_doc['hash']
        json_docs.append(json_doc)
    result=[]
    if date != "" and receiver_cursor!="" and min!="" and max!="":
        result=filtering_datetime(date,json_docs)
        result=filtering_by_email(recvEmail,result)
        result=filtering_amount(float(min),float(max),result)
    elif recvEmail!="" and date!="":
        result=filtering_by_email(recvEmail,json_docs)
        result=filtering_datetime(date,result)
    elif recvEmail!="" and min!="" and max!="":
        result=filtering_by_email(recvEmail,json_docs)
        result=filtering_amount(float(min),float(max),result)
    elif date!="" and min!="" and max!="":
        result=filtering_datetime(date,json_docs)
        result=filtering_amount(float(min),float(max),result)
    elif date!="":
        result=filtering_datetime(date,json_docs)
    elif recvEmail!="":
        result=filtering_by_email(recvEmail,json_docs)
    else :
        min=float(min)
        max=float(max)
        result=filtering_amount(min,max,json_docs)
    return json.dumps(result, default=json_util.default)




@sockets.route("/verifysocket")
def verify_notification(sockets):
    result=qu.get()
    if result=="success":
        sockets.send(True)
    elif result=="denied":
        sockets.send(False)     
