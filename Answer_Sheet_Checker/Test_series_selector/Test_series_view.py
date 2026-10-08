import json,os

def Test_series_view(Mode):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    with open(os.path.join(BASE_DIR, "Archive", "storage", "metadata.json"), "r") as f:
        meta_data = json.load(f)
    Test_series_names = []
    proper_data = []
    for file in meta_data["Test_series"]:
        name = list(file.keys())[0]
        Test_series_names.append(file[name])
    for path in Test_series_names:
        Run_ID = path.split("\\")[7]
        Test_series_name = path.split("\\")[8]
        send_path = "JSON/Archive/storage/" + Run_ID + "/" + Test_series_name
        created = "/".join([Run_ID[6:8], Run_ID[4:6], Run_ID[0:4]]), "at", ":".join([Run_ID[8:10], Run_ID[10:12], Run_ID[12:14]])
        if Mode == "Internal":
            send_details = [Test_series_name, Run_ID]
        else:
            send_details = [Test_series_name, created]
        proper_data.append((send_details,send_path))
    return proper_data