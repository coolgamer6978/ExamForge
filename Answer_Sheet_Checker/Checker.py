import os,json
def Checker(checking_data):
    print("Checking data received by Checker from Main_Directory_Controller")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    Result = []
    diagonostic = []
    options = ["A","B","C","D"]
    #Unpacking data
    test_series = checking_data["test_series"]#if user uses a custom answer key the test series name must be "custom" and set_code the name of that custom and in website the field name should be "set_identification" to make sense.
    set_code = str(checking_data["set_code"]).strip().replace(" ","_")
    answer_to_check = checking_data["answer"]
    always_right = checking_data["always_right"]
    Name = checking_data["student_name"]
    institution = checking_data["name_of_institution"]
    test_series_path = os.path.join(BASE_DIR,test_series.replace("JSON/","").replace("/","\\"))
    if test_series.split("/")[3] == "Custom":
        with open(os.path.join(test_series_path,set_code)+".json", "r") as file:
            answer_key = json.load(file)
    else:
        with open(os.path.join(test_series_path,set_code,"Answer_key.json"), "r") as file:
            answer_key = json.load(file)
    reference = answer_key["Answer_key"]
    Total_marks = len(reference)
    achieved_marks = 0
    Unattemped = 0
    for index,answer in enumerate(reference):
        if answer[0] in always_right:
            Result.append([index + 1, True])
            continue
        if answer[1] == answer_to_check[index]:
            Result.append([index + 1, True])
        else:
            Result.append([index + 1, False])
            selected_options = answer_to_check[index]
            if selected_options == "":
                selected_options = "UnAttempted"
            diagonostic.append({"Serial": str(index + 1), "correct_option": str(options[answer[1] - 1]),
                                "Selected_options": str(options[int(selected_options)-1])})
    for tally in Result:
        if tally[1]:
            achieved_marks += 1
    for ans in zip(reference,answer_to_check):
        if ans[1] == "" and ans[0][0] not in always_right:
            Unattemped += 1
    wrong = Total_marks - achieved_marks - Unattemped
    if  test_series.split("/")[3] == "Custom":
        test_series_name = set_code.strip(".json").replace("_"," ")
        set_code = "N/A"
    else:
        test_series_name = test_series.split("/")[4].replace("_"," ")
    final_report = {"Total_Marks":Total_marks,"Achieved_Marks":achieved_marks,"Unattempted_Questions":Unattemped,
                    "wrong_questions":wrong,"wrong_diagnostic":diagonostic,"test_series":test_series_name,
                    "set_code":set_code,"Student_Name":Name,"Name_of_Institution":institution}
    return final_report