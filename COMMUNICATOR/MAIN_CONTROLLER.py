import os
from Question_Paper_Generator.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_QPG
from Answer_Key_Uploader.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_AKU
from Answer_Sheet_Checker.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_ASC
from Archive.Archive_logic.Main_Directory_Controller import Main_Directory_Controller as Main_Directory_Controller_Archive
def Main_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,Sender):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if Sender == "QPG":
        print("DATA sent to Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        List_of_generated_pdf_path,set_code_coupled_raw_data_from_QPG_without_loss_of_original_serialization,test_series_path = Main_Directory_Controller_QPG(DATA_FROM_HTML_GATEWAY_COMMUNICATOR)
        print("Final_PDF_path and test_series_path received from Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        print("Data sent to Answer_Key_Uploader/Main_Directory_Controller.py by MAIN_CONTROLLER")
        Main_Directory_Controller_AKU(set_code_coupled_raw_data_from_QPG_without_loss_of_original_serialization,test_series_path,"Internal")
        print("Answer_keys have been properly saved.")
        return List_of_generated_pdf_path
    elif Sender == "AKU":
        print("DATA sent to Answer_Key_Uploader/Main_Directory_Controller.py by MAIN_CONTROLLER")
        Main_Directory_Controller_AKU(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,os.path.join(BASE_DIR,"Archive","storage","Custom"),"External")
        print("Answer_keys have been properly saved.")
        return
    elif Sender == "ASC_verify":
        print("Data sent to Answer_Sheet_Checker/Main_Directory_Controller.py by MAIN_CONTROLLER")
        verificator = Main_Directory_Controller_ASC(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"verifier")
        return verificator
    elif Sender == "ASC":
        print("Data sent to Answer_Sheet_Checker/Main_Directory_Controller.py by MAIN_CONTROLLER")
        result = Main_Directory_Controller_ASC(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,"Checker")
        return result
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