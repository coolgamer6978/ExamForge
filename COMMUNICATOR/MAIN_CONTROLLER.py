def Main_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR,Sender):
    from Question_Paper_Generator.Main_Directory_Controller import Main_Directory_Controller
    if Sender == "QPG":
        print("DATA sent to Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        List_of_generated_pdf_path = Main_Directory_Controller(DATA_FROM_HTML_GATEWAY_COMMUNICATOR)
        print("Final_PDF_path received from Question_Paper_Generator/Main_Directory_Controller.py by MAIN_CONTROLLER")
        return List_of_generated_pdf_path