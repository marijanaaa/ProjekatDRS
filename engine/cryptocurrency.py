import json
import requests

def getAssetsCoinCapAPI():
    url = 'http://api.coincap.io/v2/assets'
    parsed = json.loads(requests.get(url).content)
    return parsed