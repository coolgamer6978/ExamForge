from Answer_Sheet_Checker.verifier import verifier
from Answer_Sheet_Checker.Checker import Checker
def Main_Directory_Controller(check,receiver):
    print("check_set Received from MAIN_CONTROLLER.py")
    if receiver == "verifier":
        verification = verifier(check)
        return verification
    elif receiver == "Checker":
        result = Checker(check)
        return result
    print("WRONG RECEIVER FED INTO ASC/MDC")

    