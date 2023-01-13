from flask import Flask, jsonify, request,json,Blueprint
from database import db
from card import verification
from datetime import datetime
from flask_cors import CORS
import datetime
import jwt
from werkzeug.security import generate_password_hash,check_password_hash
from functools import wraps
import uuid
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from database_functions import *
from transactions import bp
from exchanges import bp_exc

#collections
userCollection = db["users"]
transactionCollection = db["transactions"]
cryptocurrencyCollection = db["cryptocurrencies"]

app = Flask(__name__)
CORS(app)
#sockets.init_app(app)
app.config["SECRET_KEY"] = "004f2af45d3a4e161a7dd2d17fdae47f"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
_jwt = JWTManager(app)
app.register_blueprint(bp)
app.register_blueprint(bp_exc)

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





if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)
