from flask import Flask, jsonify, request,json
from database import db
from cryptocurrency import get_assets_coin_cap_API,get_price
from card import verification
import datetime
from hash import create_hash
from enums import transaction_state
from flask_cors import CORS
import jwt
from werkzeug.security import generate_password_hash,check_password_hash
from functools import wraps
import uuid
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


#collections
userCollection = db["users"]
transactionCollection = db["transactions"]

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = "004f2af45d3a4e161a7dd2d17fdae47f"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
_jwt = JWTManager(app)

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
       token = None
       if 'Authorization' in request.headers:
           token = request.headers['Authorization']
 
       if not token:
           return jsonify({'message': 'a valid token is missing'})
       try:
           data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
           current_user = userCollection.find_one({"_id": data['_id']})
       except:
           return jsonify({'message': 'token is invalid'})
 
       return f(current_user, *args, **kwargs)
   return decorator

@app.after_request
def refresh_expiring_jwts(response):
    try:
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
    hashed_password = generate_password_hash(password, method='sha256')
    result = userCollection.insert_one({'name':name,'lastname':lastname,'address':address,'city':city,'country':country,
                              'number':number,'email':email,'password':hashed_password,'isVerified':False, 'balanceInDollars':0,
                              'cryptocurrencies':{
                                'BTC':0,
                                'ETH':0,
                                'USDT':0,
                                'BUSD':0,
                                'DOGE':0
                              }})
    if result != None:
        return jsonify({'result':'OK'})
    return jsonify({'result':'ERROR'}) #pravi od json stringa flask response
    
@app.route('/login', methods=["POST"])
def user_login():
    email = request.get_json(force=True).get('email')
    password = request.get_json(force=True).get('password')

    user = userCollection.find_one({"email":email})
    user = json.dumps(user, default=str) #napravim json format od objekta
    dict_user = json.loads(user) #napravim dictionary od tog objekta

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
    user = json.dumps(user, default=str) #napravim json format od objekta
    dict_user = json.loads(user) #napravim dictionary od tog objekta

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
        #verifikovati korisnika u bazi
        query={'email':email}
        new_value = {"$set":{'isVerfied':True}}
        result = userCollection.update_one(query,new_value)
        if result.matched_count > 0:
            return jsonify({"result":"OK"})
    return jsonify({"result":"ERROR"})

@app.route('/cardTransaction', methods=["POST"])
def card_transaction():
    email = request.get_json(force=True).get('email')
    amount_in_dollars = request.get_json(force=True).get('dollars')
    currency = request.get_json(force=True).get('currency')
    return "maja"

@app.route('/getTransactions', methods=["GET"])
def get_transactions():
    email = request.get_json(force=True).get('email')
    collection = transactionCollection.find({"email": email})
    return json.dumps(collection, default=json)


@app.route('/sortTransactions', methods=["GET"])
def sort_transactions():
    email = request.get_json(force=True).get('email')
    collection = transactionCollection.find({"email": email})
    dates=[]
    #treba vidjeti kakav ce format datuma biti
    for date in collection:
        dates.append(date)
    dates.sort(key = lambda date: datetime.datetime.strptime(date, '%d %b %Y'))
    return json.dumps(dates,default=str)

#u zavisnosti po cemu ce se filtrirati, ja cu ovde samo po stanju transakcije npr za slucaj odbijeno
@app.route('/filterTransactions/denied', methods=["GET"])
def filter_transactions():
    email = request.get_json(force=True).get('email')
    transaction_state = request.get_json(force=True).get('transactionState')
    #hocemo sve transakcije koje je inicirao ili primao
    collection = transactionCollection.find({"sender": email}, {"receiver":email}, 
                                            {"transactionState":transaction_state})
    return json.dumps(collection, default=json)

#iniciranje nove transakcije drugom korisniku koji ima otvoren on-line racun
#u sustini prebacivanje sa svog na drugi on-line racun
#socketi
#treba napraviti provere postojanja korisnika
@app.route('/newTransaction',methods=["POST"])
def new_transaction():
    sender_email = request.get_json(force=True).get('sender_email')
    receiver_email = request.get_json(force=True).get('receiver_email')
    amount = request.get_json(force=True).get('amount')
    cryptocurrency = request.get_json(force=True).get('cryptocurrency')
    #treba proveriti da li taj email postoji
    user = userCollection.find_one({"email":receiver_email})
    if user == None:
        return jsonify({"result":"ERROR"})

    hash = create_hash(sender_email, receiver_email, amount)
    userCollection.insert_one({'hash':hash,'sender':sender_email,'receiver':receiver_email,
                               'cryptocurrency':cryptocurrency,'amount':amount,'state': transaction_state.PROCESSING})
    #stanje na pocetku je u obradi pa se kasnije mijenja u zavisnoti od vremena  ! ! !


if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)
