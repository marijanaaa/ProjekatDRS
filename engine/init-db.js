db = db.getSiblingDB("cryptocurrency_db");
db.cryptocurrency_db.drop();
userCollection = db["users"]
//transakcije se samo inicijalizuju kao kolekcija, nema inicijalnih podataka
transactionCollection = db["transactions"]

userCollection.insertMany([
    {
        "_id": 1,
        "name": "Marijana",
        "lastname": "Stojanovic",
        "address" : "Danila Kisa 26",
        "town": "Novi Sad",
        "state": "Republika Srbija",
        "number": "0649163524",
        "email": "marijanaaastojanovic@gmail.com",
        "password": 1234,
        "isVerified": true,
        "cryptocurrencies":{
            "BTC":0,
            "ETH":0,
            "USDT":0,
            "BUSD":0,
            "DOGE":0
        },
        "balanceInDollars":0
    },
    {
        "_id": 2,
        "name": "Katarina",
        "lastname": "Prodanovic",
        "address" : "Danila Kisa 26",
        "town": "Novi Sad",
        "state": "Republika Srbija",
        "number": "0649163524",
        "email": "katarina@gmail.com",
        "password": 1234,
        "isVerified": true,
        "cryptocurrencies":{
            "BTC":0,
            "ETH":0,
            "USDT":0,
            "BUSD":0,
            "DOGE":0
        },
        "balanceInDollars":0
    },
]);


