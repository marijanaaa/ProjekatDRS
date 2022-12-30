db = db.getSiblingDB("cryptocurrency_db");
db.cryptocurrency_db.drop();
userCollection = db["users"]
//transakcije se samo inicijalizuju kao kolekcija, nema inicijalnih podataka
transactionCollection = db["transactions"]
cryptocurrencyCollection = db["cryptocurrencies"]




