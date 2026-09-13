import os
def verifier(verification):
    print("check Received from Main_Directory_Controller.py")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    check_test_series = os.path.join(BASE_DIR,"Archive","storage",str(verification[0]))
    if os.path.isdir(check_test_series):
        pass
    else:
        return "Test Series "+str(verification[0])+" not found."
    check_set_code = os.path.join(check_test_series,str(verification[1]))
    if os.path.isdir(check_set_code):
        pass
    else:
        return "set_identifier "+str(verification[1])+" not found under the Test Series "+str(verification[0])
    if str(verification[0]) == "Custom":#for the case where user uses the self added answer key
        return "OK"
    check_answer_key = os.path.join(check_set_code,"Answer_key.json")
    if os.path.isfile(check_answer_key):
        pass
    else:
        return "Answer_key not found under the set_code "+str(verification[1])+" of the Test Series "+str(verification[0])
    return "OK"

