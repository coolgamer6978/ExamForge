import os

def Test_series_search(parameters,items):
    # {year:,month:,day:,Test_series:} default to "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    metadata = {
    "Run_ID": [],
    "Test_series": [],
    "set_code":[],
    "File_name": []
    }
    for item in items:
        Run_ID = item[0][1]
        Test_series = item[0][0]
        metadata["Run_ID"].append({Run_ID:os.path.join(BASE_DIR,"Archive","storage",Run_ID)})
        metadata["Test_series"].append({Test_series:os.path.join(BASE_DIR,"Archive","storage",Run_ID,Test_series)})
        metadata["set_code"].append({})
        metadata["File_name"].append({})
    parameters["set_code"] = "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    parameters["file_name"] = "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    print(parameters,metadata)
    return parameters , metadata