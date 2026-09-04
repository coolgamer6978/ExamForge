from Question_Paper_Generator.Main_Directory_Controller import Main_Directory_Controller
def Main_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,Sender):
    if Sender == "QPG":
        print("DATA sent to Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        Main_Directory_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR)