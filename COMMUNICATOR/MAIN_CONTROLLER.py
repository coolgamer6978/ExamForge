import os
from Question_Paper_Generator.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_QPG
from Answer_Key_Uploader.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_AKU
from Answer_Sheet_Checker.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_ASC
from Archive.Archive_logic.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_Archive
def Main_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,Sender):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if Sender in ("QPG","QPG+SAVE"):
        print("DATA sent to Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        if Sender == "QPG":
            List_of_generated_pdf_path,set_code_coupled_raw_data_from_QPG_without_loss_of_original_serialization,test_series_path = Main_Directory_Controller_QPG(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,None)
        else:
            List_of_generated_pdf_path, set_code_coupled_raw_data_from_QPG_without_loss_of_original_serialization, test_series_path = Main_Directory_Controller_QPG(DATA_FROM_HTML_GATEWAY_COMMUNICATOR, "save_question")
        print("Final_PDF_path and test_series_path received from Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        print("Data sent to Answer_Key_Uploader/Main_Directory_Controller.py by MAIN_CONTROLLER")
        Main_Directory_Controller_AKU(set_code_coupled_raw_data_from_QPG_without_loss_of_original_serialization,test_series_path,"Internal")
        print("Answer_keys have been properly saved.")
        return List_of_generated_pdf_path
    elif Sender == "QPG_save":
        items = Main_Directory_Controller_QPG("","view_saved_question")
        return items
    elif Sender == "QPG_search":
        parameters,data = Main_Directory_Controller_QPG(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"search_question_saves")
        Result = Main_Directory_Controller_Archive((parameters,data),"Search_QPG")
        return Result
    elif Sender == "QPG_format":
        result = Main_Directory_Controller_QPG(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"Format_json")
        return result
    elif Sender == "AKU_verify":
        print("DATA sent to Answer_Key_Uploader/Main_Directory_Controller.py by MAIN_CONTROLLER")
        report = Main_Directory_Controller_AKU(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,os.path.join(BASE_DIR,"Archive","storage","Custom"),"verify")
        print("Answer_keys have been properly saved.")
        return report
    elif Sender == "AKU":
        print("DATA sent to Answer_Key_Uploader/Main_Directory_Controller.py by MAIN_CONTROLLER")
        Main_Directory_Controller_AKU(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,os.path.join(BASE_DIR,"Archive","storage","Custom"),"External")
        print("Answer_keys have been properly saved.")
        return
    elif Sender == "ASC_Test_series_view":
        items = Main_Directory_Controller_ASC("", "view_Test_series")
        return items
    elif Sender == "ASC_search":
        parameters,data = Main_Directory_Controller_ASC(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"search_Test_series")
        Result = Main_Directory_Controller_Archive((parameters,data),"Search_ASC")
        return Result
    elif Sender == "ASC_verify":
        print("Data sent to Answer_Sheet_Checker/Main_Directory_Controller.py by MAIN_CONTROLLER")
        verificator,num_of_ans = Main_Directory_Controller_ASC(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"verifier")
        return verificator,num_of_ans
    elif Sender == "ASC":
        print("Data sent to Answer_Sheet_Checker/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result,report = Main_Directory_Controller_ASC(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"Checker")
        return result,report
    elif Sender == "Archive_search":
        print("Data sent to Archive/Archive_logic/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_Archive(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"Search")
        return result
    elif Sender == "Archive_storage":
        print("Request sent to Archive/Archive_logic/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_Archive(
            os.path.join(BASE_DIR,"Archive",DATA_FROM_HTML_GATEWAY_COMMUNICATOR[0]),"Navigation")
        return result
    elif Sender == "Archive_Run_ID":
        print("Request sent to Archive/Archive_logic/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_Archive(
            os.path.join(BASE_DIR, "Archive", DATA_FROM_HTML_GATEWAY_COMMUNICATOR[0],DATA_FROM_HTML_GATEWAY_COMMUNICATOR[1]),
            "Navigation")
        return result
    elif Sender == "Archive_Test_series_name":
        print("Request sent to Archive/Archive_logic/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_Archive(
            os.path.join(BASE_DIR, "Archive", DATA_FROM_HTML_GATEWAY_COMMUNICATOR[0],DATA_FROM_HTML_GATEWAY_COMMUNICATOR[1]
                         ,DATA_FROM_HTML_GATEWAY_COMMUNICATOR[2]),
            "Navigation")
        return result
    elif Sender == "Archive_Set_code":
        print("Request sent to Archive/Archive_logic/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_Archive(
            os.path.join(BASE_DIR, "Archive", DATA_FROM_HTML_GATEWAY_COMMUNICATOR[0],DATA_FROM_HTML_GATEWAY_COMMUNICATOR[1]
                         ,DATA_FROM_HTML_GATEWAY_COMMUNICATOR[2],DATA_FROM_HTML_GATEWAY_COMMUNICATOR[3]),
            "Navigation")
        return result