import os,json
def Checker(checking_data):
    print("Checking data received by Checker from Main_Directory_Controller")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    Result = []
    diagonostic = []
    options = ["A","B","C","D"]
    #Unpacking data
    test_series = checking_data["test_series"]#if user uses a custom answer key the test series name must be "custom" and set_code the name of that custom and in website the field name should be "set_identification" to make sense.
    set_code = checking_data["set_code"]
    answer_to_check = checking_data["answer"]
    always_right = checking_data["always_right"]
    if test_series == "Custom":
        with open(os.path.join(BASE_DIR,"Archive","storage",test_series,set_code), "r") as file:
            answer_key = json.load(file)
    else:
        with open(os.path.join(BASE_DIR,"Archive","storage",test_series,set_code,"Answer_key.json"), "r") as file:
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
            diagonostic.append({"Serial": str(index + 1), "correct_option": str(options[answer[1] - 1]),
                                "Selected_options": answer_to_check[index]})
    for tally in Result:
        if tally[1]:
            achieved_marks += 1
    for ans in answer_to_check:
        if ans == "":
            Unattemped += 1
    wrong = Total_marks - achieved_marks - Unattemped
    final_report = {"Total_Marks":Total_marks,"Achieved_Marks":achieved_marks,"Unattemped_question":Unattemped,
                    "wrong_question":wrong,"wrong_diagonostic":diagonostic}
    return final_report