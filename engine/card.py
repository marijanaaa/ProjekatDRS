def verification(number, name, year, month, day, security_code):
    if(number == "4242424242424242" and name != None 
        and year == "2023" and month == "02" and day == "23" and security_code == "123"):
        return True
    else:
        return False
