import random
from Crypto.Hash import keccak
import binascii

#treba staviti mnogo veci random range
def create_hash(sender, receiver, amount):
    random_number = random.randint(3, 9)
    input = sender + receiver + amount + str(random_number)
    #ili je encoding = "utf-8"
    keccak256 = keccak.new(data=bytes(input, encoding="ascii"), digest_bits=256).digest()
    hash = binascii.hexlify(keccak256)
    return hash