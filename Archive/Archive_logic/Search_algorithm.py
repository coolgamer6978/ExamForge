import os,json
def Search_algorithm(data_from_MDC,Mode):
    print("search parameters received from MDC by Search_algorithm.py")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    #{year:,month:,day:,test_series:,set_code:,file_name:} default to "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    Default_value = "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    if Mode == "normal":
        with open(os.path.join(BASE_DIR,"Archive","storage","metadata.json"), "r") as file:
            metadata = json.load(file)
    elif Mode == "QPG":
        metadata = data_from_MDC[1]
        data_from_MDC = data_from_MDC[0]
    elif Mode == "ASC":
        metadata = data_from_MDC[1]
        data_from_MDC = data_from_MDC[0]
    RUN_ID = 7
    test_series_name = 8
    SET_CODE = 9
    file_name = 10
    Custom_file_name = 8
    sort_list_for_year = []
    sort_list_for_month = []
    sort_list_for_day = []
    final_list_for_date = []#stores the actual path
    sort_list_for_test_series = []
    final_list_for_test_series = []#stores the actual path
    final_list_for_date_and_test_series = []#stores the actual path
    sort_list_for_set_code = []
    final_list_for_set_code = [] #stores the actual path
    final_list_for_date_and_test_series_and_set_code = []#stores actual path
    sort_list_for_file_name = []
    final_list_for_file_name = []#stores actual path
    mid_process = []
    key_extractor_Date = []
    key_extractor_Test_series = []
    key_extractor_Set_code = []
    key_extractor_File_name = []
    Result = []#stores actual path
    def Test_series_formater(data):
        for path in data:
            Run_ID = path.split("\\")[RUN_ID]
            Test_series_name = path.split("\\")[test_series_name]
            send_path = "JSON/Archive/storage/" + Run_ID + "/" + Test_series_name
            created = "/".join([Run_ID[6:8],Run_ID[4:6],Run_ID[0:4]]),"at",":".join([Run_ID[8:10],Run_ID[10:12],Run_ID[12:14]])
            send_details = [Test_series_name,created]
            Result.append((send_details,send_path))
        return Result
    if data_from_MDC["year"] == Default_value:
        for process in metadata["Run_ID"]:
            key_extractor_Date.append(list(process.keys())[0])
        for item in key_extractor_Date:
            if item not in sort_list_for_year:
                sort_list_for_year.append(item)
    else:
        for run_id_mid in metadata["Run_ID"]:
            run_id = list(run_id_mid.keys())[0]
            if data_from_MDC["year"] in run_id[:4] and run_id not in sort_list_for_year:
                sort_list_for_year.append(run_id)
    if data_from_MDC["month"] == Default_value:
        sort_list_for_month = sort_list_for_year
    else:
        for run_id in sort_list_for_year:
            if data_from_MDC["month"] in run_id[4:6] and run_id not in sort_list_for_month:
                sort_list_for_month.append(run_id)
    if data_from_MDC["day"] == Default_value:
        sort_list_for_day = sort_list_for_month
    else:
        for run_id in sort_list_for_month:
            if data_from_MDC["day"] in run_id[6:8] and run_id not in sort_list_for_day:
                sort_list_for_day.append(run_id)
    for selected in sort_list_for_day:
        for index,candidate in enumerate(list(list(x.keys())[0] for x in metadata["Run_ID"])):
            if selected == candidate:
                final_list_for_date.append(metadata["Run_ID"][index][selected])
    if data_from_MDC["test_series"] == Default_value:
        for process in metadata["Test_series"]:
            key_extractor_Test_series.append(list(process.keys())[0])
        for item in key_extractor_Test_series:
            if item not in sort_list_for_test_series:
                sort_list_for_test_series.append(item)
    else:
        for test_series_mid in metadata["Test_series"]:
            test_series_key = list(test_series_mid.keys())[0]
            if str(data_from_MDC["test_series"]).lower().replace(" ","_").strip() in str(test_series_key).lower().replace(" ","_").strip() and test_series_key not in sort_list_for_test_series:
                sort_list_for_test_series.append(test_series_key)
    for selected in sorted(sort_list_for_test_series,key=len):
        for index,candidate in enumerate(list(list(x.keys())[0] for x in metadata["Test_series"])):
            if selected == candidate:
                final_list_for_test_series.append(metadata["Test_series"][index][selected])
    for selected in final_list_for_date:
        for index,candidate in enumerate(final_list_for_test_series):
            if os.path.normpath(selected).split(os.sep)[RUN_ID] == os.path.normpath(candidate).split(os.sep)[RUN_ID] and final_list_for_test_series[index] not in final_list_for_date_and_test_series:
                final_list_for_date_and_test_series.append(final_list_for_test_series[index])
    if Mode == "ASC":
        Result = Test_series_formater(final_list_for_date_and_test_series)
        return Result
    if data_from_MDC["set_code"] == Default_value:
        for process in metadata["set_code"]:
            key_extractor_Set_code.append(list(process.keys())[0])
        for item in key_extractor_Set_code:
            if item not in sort_list_for_set_code:
                sort_list_for_set_code.append(item)
    else:
        for set_code_mid in metadata["set_code"]:
            set_code_key = list(set_code_mid.keys())[0]
            if str(data_from_MDC["set_code"]).replace(" ","_").strip() in str(set_code_key).replace(" ","_").strip() and set_code_key not in sort_list_for_set_code:
                sort_list_for_set_code.append(set_code_key)
    for selected in sort_list_for_set_code:
        for index, candidate in enumerate(list(list(x.keys())[0] for x in metadata["set_code"])):
            if selected == candidate:
                final_list_for_set_code.append(metadata["set_code"][index][selected])
    for selected in final_list_for_date_and_test_series:
        for index,candidate in enumerate(final_list_for_set_code):
            part_selected_path = os.path.normpath(selected).split(os.sep)
            part_candidate_path = os.path.normpath(candidate).split(os.sep)
            selected_identity = (part_selected_path[RUN_ID],part_selected_path[test_series_name])
            candidate_identity = (part_candidate_path[RUN_ID],part_candidate_path[test_series_name])
            if selected_identity == candidate_identity and final_list_for_set_code[index] not in final_list_for_date_and_test_series_and_set_code:
                final_list_for_date_and_test_series_and_set_code.append(final_list_for_set_code[index])
    if data_from_MDC["file_name"] == Default_value:
        for process in metadata["File_name"]:
            key_extractor_File_name.append(list(process.keys())[0])
        for item in key_extractor_File_name:
            if item not in sort_list_for_file_name:
                sort_list_for_file_name.append(item)
    else:
        for file_name_mid in metadata["File_name"]:
            File_name = list(file_name_mid.keys())[0]
            if str(data_from_MDC["file_name"]).lower().replace(" ","_").strip() in str(File_name).lower().replace(" ","_").strip() and File_name not in sort_list_for_file_name:
                sort_list_for_file_name.append(File_name)
    for selected in sorted(sort_list_for_file_name,key=len):
        for index,candidate in enumerate(list(list(x.keys())[0] for x in metadata["File_name"])):
            if selected == candidate:
                final_list_for_file_name.append(metadata["File_name"][index][selected])
    for selected in final_list_for_date_and_test_series_and_set_code:
        for index,candidate in enumerate(final_list_for_file_name):
            if os.path.normpath(candidate).split(os.sep)[RUN_ID] == "Custom":
                if str(data_from_MDC["file_name"]).lower().replace(" ","_").strip() in os.path.normpath(candidate).split(os.sep)[Custom_file_name].lower() and final_list_for_file_name[index] not in mid_process and all(data_from_MDC[field] == Default_value for field in ("year","month","day","test_series","set_code")):
                    mid_process.append(final_list_for_file_name[index])
            else:
                part_selected_path = os.path.normpath(selected).split(os.sep)
                part_candidate_path = os.path.normpath(candidate).split(os.sep)
                selected_identity = (part_selected_path[RUN_ID],part_selected_path[test_series_name],part_selected_path[SET_CODE])
                candidate_identity = (part_candidate_path[RUN_ID],part_candidate_path[test_series_name],part_candidate_path[SET_CODE])
                if  selected_identity == candidate_identity and final_list_for_file_name[index] not in mid_process:
                    mid_process.append(final_list_for_file_name[index])
    if Mode == "normal":
        for matches in mid_process:
            if os.path.normpath(matches).split(os.sep)[RUN_ID] == "Custom":
                name_matches = os.path.normpath(matches).split(os.sep)[Custom_file_name]
            else:
                name_matches = os.path.normpath(matches).split(os.sep)[file_name]
            path = os.path.normpath(matches).split(os.sep)[RUN_ID:]
            path_for_sending = "/".join(path)
            Result.append([name_matches, "file","Search",path_for_sending])
    elif Mode == "QPG":
        for path in mid_process:
            Run_ID = path.split("\\")[RUN_ID]
            Test_series_name = path.split("\\")[test_series_name]
            rest = "/".join(path.split("\\")[SET_CODE:])
            send_path = "JSON/Archive/storage/" + Run_ID + "/" + Test_series_name + "/" + rest
            send_name = "questions.json"
            created = "/".join([Run_ID[6:8],Run_ID[4:6],Run_ID[0:4]]),"at",":".join([Run_ID[8:10],Run_ID[10:12],Run_ID[12:14]])
            send_details = [Test_series_name,created]
            Result.append((send_name, send_path,send_details))
    return Result