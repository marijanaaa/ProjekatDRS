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
    
def get_coins_from_dollars(dollars,symbol):
    price_of_symbol=get_price(get_assets_coin_cap_API(),symbol)
    return float(dollars)/float(price_of_symbol)
    



