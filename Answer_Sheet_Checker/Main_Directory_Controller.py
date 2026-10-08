import threading
from Answer_Sheet_Checker.verifier import verifier
from Answer_Sheet_Checker.Checker import Checker
from Answer_Sheet_Checker.result_generator import Result_Generator
from Answer_Sheet_Checker.Test_series_selector.Test_series_search import Test_series_search
from Answer_Sheet_Checker.Test_series_selector.Test_series_view import Test_series_view
def Main_Directory_Controller(check,receiver):
    ASC_MDC_lock = threading.Lock()
    with ASC_MDC_lock:
        print("check_set Received from MAIN_CONTROLLER.py")
        if receiver == "verifier":
            verification,num_of_ans = verifier(check)
            return verification,num_of_ans
        elif receiver == "Checker":
            result = Checker(check)
            Report,showcase = Result_Generator(result)
            return showcase,Report
        elif receiver == "view_Test_series":
            data = Test_series_view(None)
            return data
        if receiver == "search_Test_series":
            items = Test_series_view("Internal")
            parameters,data = Test_series_search(check,items)
            return parameters,data
        print("WRONG RECEIVER FED INTO ASC/MDC")

    