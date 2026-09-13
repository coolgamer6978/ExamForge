import os,json
def Search_algorithm(data_from_MDC):
    print("search parameters received from MDC by Search_algorithm.py")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    #{year:,month:,day:,Test_series:,set_code:,file_name:} default to "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    Default_value = "WUdhwI@!831*D@dD2h2dh23#@E&@@(jN@UHWKDhhHDuwg29ej203d2u"
    with open(os.path.join(BASE_DIR,"Archive","storage","metadata.json"), "r") as file:
        metadata = json.load(file)
    RUN_ID = 7
    test_series_name = 8
    SET_CODE = 9
    sort_list_for_year = []
    sort_list_for_month = []
    sort_list_for_day = []
    final_list_for_date = []#stores the actual path
    sort_list_for_test_series = []
    final_list_for_test_series = []#stores the actual path
    final_list_for_date_and_test_series = []#stores the actual path
    final_list_for_set_code = [] #stores the actual path
    final_list_for_date_and_test_series_and_set_code = []#stores actual path
    sort_list_for_file_name = []
    final_list_for_file_name = []#stores actual path
    Result = []#stores actual path
    if data_from_MDC["year"] == Default_value:
        sort_list_for_year = list(metadata["Run_ID"].keys())
    else:
        for run_id in metadata["Run_ID"].keys():
            if data_from_MDC["year"] in run_id[:4]:
                sort_list_for_year.append(run_id)
    if data_from_MDC["month"] == Default_value:
        sort_list_for_month = sort_list_for_year
    else:
        for run_id in sort_list_for_year:
            if data_from_MDC["month"] in run_id[4:6]:
                sort_list_for_month.append(run_id)
    if data_from_MDC["day"] == Default_value:
        sort_list_for_day = sort_list_for_month
    else:
        for run_id in sort_list_for_month:
            if data_from_MDC["day"] in run_id[6:8]:
                sort_list_for_day.append(run_id)
    for selected in sort_list_for_day:
        for index,candidate in enumerate(metadata["Run_ID"].keys()):
            if selected == candidate:
                final_list_for_date.append(metadata["Run_ID"][index][selected])
    if data_from_MDC["test_series"] == Default_value:
        sort_list_for_test_series = list(metadata["Test_series"].keys())
    else:
        for test_series in metadata["Test_series"].keys():
            if str(data_from_MDC["test_series"]).lower() in str(test_series).lower():
                sort_list_for_test_series.append(test_series)
    for selected in sorted(sort_list_for_test_series,key=len):
        for index,candidate in enumerate(metadata["Test_series"].keys()):
            if str(selected).lower() == str(candidate).lower():
                final_list_for_test_series.append(metadata["Test_series"][index][selected])
    for selected in final_list_for_date:
        for index,candidate in enumerate(final_list_for_test_series):
            if os.path.normpath(selected).split(os.sep)[RUN_ID].lower() in os.path.normpath(candidate).split(os.sep)[RUN_ID].lower():
                final_list_for_date_and_test_series.append(final_list_for_test_series[index])
    if data_from_MDC["set_code"] == Default_value:
        final_list_for_set_code = list(metadata["set_code"].keys())
    else:
        for index,set_code in enumerate(metadata["set_code"].keys()):
            if str(data_from_MDC["set_code"]).lower() in str(set_code).lower():
                final_list_for_set_code.append(metadata["set_code"][index][set_code])
    for selected in final_list_for_date_and_test_series:
        for index,candidate in enumerate(final_list_for_set_code):
            if os.path.normpath(selected).split(os.sep)[test_series_name].lower() in os.path.normpath(candidate).split(os.sep)[test_series_name].lower():
                final_list_for_date_and_test_series_and_set_code.append(final_list_for_set_code[index])
    if data_from_MDC["file_name"] == Default_value:
        sort_list_for_file_name = list(metadata["File_name"].keys())
    else:
        for file_name in metadata["File_name"].keys():
            if str(data_from_MDC["file_name"]).lower() in str(file_name).lower():
                sort_list_for_file_name.append(file_name)
    for selected in sorted(sort_list_for_file_name,key=len):
        for index,candidate in enumerate(metadata["File_name"].keys()):
            if str(selected).lower() == str(candidate).lower():
                final_list_for_file_name.append(metadata["File_name"][index][selected])
    for selected in final_list_for_date_and_test_series_and_set_code:
        for index,candidate in enumerate(final_list_for_file_name):
            if os.path.normpath(selected).split(os.sep)[SET_CODE].lower() in os.path.normpath(candidate).split(os.sep)[SET_CODE].lower():
                Result.append(final_list_for_file_name[index])
    return Result