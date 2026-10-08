import os
def Navigator(path):
    data_inside = os.listdir(path)
    if "metadata.json" in data_inside:
        data_inside.remove("metadata.json")
    result = []
    for item in data_inside:
        if os.path.isdir(os.path.join(path,item)):
            result.append([item,"dir"])
        elif os.path.isfile(os.path.join(path,item)):
            result.append([item,"file"])
        else:
            raise RuntimeError("ILLEGAL ITEM IN "+path)
    return result