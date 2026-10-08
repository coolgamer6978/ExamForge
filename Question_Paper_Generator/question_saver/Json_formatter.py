import os,json

def Json_Formatter(Json):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    path = Json["path"]
    path = path.replace("JSON/Archive/storage/", "")
    path = path.replace("/", "\\")
    archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
    json_path = os.path.join(archive_dir, path)
    result = []
    with open(json_path,"r") as file:
        data = json.load(file)
    for Range in Json["range"]:
        for elements in data[Range[0]-1:Range[1]]:
            result.append(elements)
    for individual in Json["single"]:
        result.append(data[individual-1])
    for instance in result:
        c = 0
        for element in result:
            if instance == element:
                c += 1
                if c > 1:
                    result.remove(element)
    return result