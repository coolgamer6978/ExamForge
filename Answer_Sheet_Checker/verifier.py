import os,json
def verifier(verification):
    num_of_answers = None
    print("check Received from Main_Directory_Controller.py")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    Test_series_path = os.path.join(BASE_DIR,verification[0].replace("JSON/","").replace("/","\\"))
    check_test_series = Test_series_path
    print(check_test_series)
    if os.path.isdir(check_test_series):
        pass
    else:
        return "Test Series "+str(verification[0].split("/")[4])+" not found."
    check_set_code = os.path.join(check_test_series,str(verification[1]).strip().replace(" ","_"))
    print(check_set_code)
    if os.path.isfile(check_set_code+".json"):#for the case where user uses the self added answer key
        file_path = check_set_code+".json"
        with open(file_path, "r") as f:
            ans = json.load(f)
            num_of_answers = len(ans["Answer_key"])
        print(ans)
        print(num_of_answers)
        return "OK",num_of_answers
    if os.path.isdir(check_set_code):
        pass
    else:
        return "set_identifier "+str(verification[1])+" not found under the Test Series "+str(verification[0].split("/")[4])

    if verification[0].split("/")[3] != "Custom":
        check_answer_key = os.path.join(check_set_code,"Answer_key.json")
        if os.path.isfile(check_answer_key):
            pass
        else:
            return "Answer_key not found under the set_code "+str(verification[1])+" of the Test Series "+str(verification[0].split("/")[4])

    file_path = check_answer_key
    with open(file_path,"r") as f:
        ans = json.load(f)
        num_of_answers = len(ans["Answer_key"])

    return "OK",num_of_answers