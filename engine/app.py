from flask import Flask, jsonify, request
from database import db
from cryptocurrency import get_assets_coin_cap_API,get_price
from card import verification
from datetime import datetime #za sortiranje transakcija
from hash import create_hash
from enums import transaction_state
from flask_cors import CORS


#collections
userCollection = db["users"]
transactionCollection = db["transactions"]

app = Flask(__name__)
CORS(app)

@app.route('/')
def ping_server():
    return "Welcome to cryptocurrency."

@app.route('/users')
def get_stored_users():
    _users = userCollection.find({})
    users = [{"id": user["_id"], "name": user["name"], "lastname": user["lastname"],
            "address":user["address"], "town":user["town"], "state":user["state"],
            "number": user["number"],"email": user["email"], "password": user["password"], 
            "isVerified": user["isVerified"]} for user in _users]
    return jsonify({"users": users})

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
    result = userCollection.insert_one({'name':name,'lastname':lastname,'address':address,'city':city,'country':country,
                              'number':number,'email':email,'password':password,'isVerified':False,
                              'cryptocurrencies':{
                                'BTC':0,
                                'ETH':0,
                                'USDT':0,
                                'BUSD':0,
                                'DOGE':0
                              }})
    if result != None:
        return jsonify({'result':'OK'})
    return jsonify({'result':'ERROR'})
    
@app.route('/login', methods=["POST"])
def user_login():
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')
    user = userCollection.find_one({"email":email, "password": password})
    return jsonify({'result':user})

    

@app.route('/edit', methods=["PUT"])
def edit_profile():
    name = request.get_json(force=True).get('name')
    lastname = request.get_json(force=True).get('lastname')
    address = request.get_json(force=True).get('address')
    city = request.get_json(force=True).get('city')
    country = request.get_json(force=True).get('country')
    number = request.get_json(force=True).get('number')
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')

    query={'_id':2}
    new_values={"$set":{'name':name,'lastname':lastname,'address':address,'city':city,'country':country,
           'number':number,'email':email,'password':password}}
    return jsonify({'result':userCollection.update_one(query,new_values)})


@app.route('/verification', methods=["POST"])
def user_verification():
    user_id = request.form.get('id')
    number = request.form.get('number')
    name = request.form.get('name')
    expiration_date = request.form.get('expiration_date')
    security_code = request.form.get('security_code')
    result = verification(number, name, expiration_date, security_code)
    if(result == True):
        #verifikovati korisnika u bazi
        query={'_id':user_id}
        new_value = {"$set":{'isVerfied':True}}
    return result

#prebacivanje sa platne kartice na crypto racun, Nela radi
#ubaciti sockete tu
@app.route('/cardTransaction', methods=["POST"])
def card_transaction():
    return "maja"

@app.route('/getTransactions', methods=["GET"])
def get_transactions():
    user_id = request.form.get('id')
    collection = transactionCollection.find({"userId": user_id})
    return collection

@app.route('/sortTransactions', methods=["GET"])
def sort_transactions():
    user_id = request.form.get('id')
    collection = transactionCollection.find({"userId": user_id})
    dates=[]
    #treba vidjeti kakav ce format datuma biti
    for date in collection:
        dates.append(date)
    dates.sort(key = lambda date: datetime.strptime(date, '%d %b %Y'))
    return dates

#u zavisnosti po cemu ce se filtrirati, ja cu ovde samo po stanju transakcije npr za slucaj odbijeno
@app.route('/filterTransactions/denied', methods=["GET"])
def filter_transactions():
    user_id = request.form.get('id')
    transaction_state = request.form.get('transactionState')
    collection = transactionCollection.find({"transactionState": transaction_state})
    return collection

#iniciranje nove transakcije drugom korisniku koji ima otvoren on-line racun
#u sustini prebacivanje sa svog na drugi on-line racun
#socketi
#treba napraviti provere postojanja korisnika
@app.route('/newTransaction',methods=["POST"])
def new_transaction():
    #receiver id cemo dobiti dobavljanjem preko njegovog email-a
    sender_id = request.form.get('id')
    receiver_email = request.form.get('email')
    amount = request.form.get('amount')
    cryptocurrency = request.form.get('cryptocurrency')
    #treba proveriti da li taj email postoji
    receiver_id = userCollection.find_one({"email": receiver_email})
    hash = create_hash(sender_id, receiver_id, amount)
    userCollection.insert_one({'hash':hash,'sender':sender_id,'receiver':receiver_id,
                               'cryptocurrency':cryptocurrency,'amount':amount,'state': transaction_state.PROCESSING})
    #stanje na pocetku je u obradi pa se kasnije mijenja u zavisnoti od vremena  ! ! !


if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)
