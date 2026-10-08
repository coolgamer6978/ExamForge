import os

def Saved_question_search(parameters,items):
    # {year:,month:,day:,Test_series:,file_name:} default to "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    metadata = {
    "Run_ID": [],
    "Test_series": [],
    "set_code":[],
    "File_name": []
    }
    for item in items:
        name = item[0]
        path = item[1]
        Run_ID = item[2][1]
        Test_series = item[2][0]
        metadata["Run_ID"].append({Run_ID:os.path.join(BASE_DIR,"Archive","storage",Run_ID)})
        metadata["Test_series"].append({Test_series:os.path.join(BASE_DIR,"Archive","storage",Run_ID,Test_series)})
        metadata["set_code"].append({"0000":os.path.join(BASE_DIR,"Archive","storage",Run_ID,Test_series,"0000")})
        metadata["File_name"].append({name:os.path.join(BASE_DIR,path.replace("JSON/","").replace("/","\\"))})
    parameters["set_code"] = "0000"
    print(parameters,metadata)
    return parameters , metadata