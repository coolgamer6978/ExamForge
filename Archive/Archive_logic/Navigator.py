import os
def Navigator(path):
    data_inside = os.listdir(path)
    if "metadata.json" in data_inside:
        data_inside.remove("metadata.json")
    return data_inside