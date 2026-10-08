import copy,os,json,portalocker


def Saved_question_Handler(Original_data,location):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    lock_path = os.path.join(BASE_DIR,"FILE_lock","metadata.json.lock")
    desynced_data = copy.deepcopy(Original_data)
    serialized_data = desynced_data["Question_paper"]
    for question in serialized_data:
        del question["serial"]
    deserialized_data = serialized_data#this line is here just to edit the name
    save_location = os.path.join(location,"0000","questions.json")
    with open(save_location,"w") as file:
        json.dump(deserialized_data,file)
    with portalocker.Lock(lock_path,timeout=None):
        with open(os.path.join(BASE_DIR, "Archive", "storage", "metadata.json"), "r") as f:
            meta_data = json.load(f)
        meta_data["File_name"].append({"questions.json":save_location})
        with open(os.path.join(BASE_DIR, "Archive", "storage", "metadata.json"), "w") as f:
            json.dump(meta_data, f, indent=4)
    return
