import json
import requests

def get_assets_coin_cap_API():
    url = 'http://api.coincap.io/v2/assets'
    parsed = json.loads(requests.get(url).content)
    data = parsed["data"]
    return data

def get_price(data,symbol):
    for element in data:
        if element["symbol"]==symbol:
            return element["priceUsd"]
    

