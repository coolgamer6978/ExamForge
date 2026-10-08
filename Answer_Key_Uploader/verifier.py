import os
def verifier(name,path):
    current_names = os.listdir(path)
    if str(name).strip().replace(" ","_")+".json" in current_names:
        return "YES"
    return "NO"