def verification(number, name, expiration_date, security_code):
    if(number == "4242424242424242" and name != None 
        and expiration_date == "02/23" and security_code == "123"):
        return True
    else:
        return False
