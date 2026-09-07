def Main_Directory_Controller(DATA_FROM_MAIN_CONTROLLER):
    import copy
    from Question_Paper_Generator.Processor.Data_Pre_processor import Data_Pre_processor
    from Question_Paper_Generator.Processor.Randomiser import Randomiser
    from Question_Paper_Generator.Processor.Question_Paper_Generator import QPG
    from Question_Paper_Generator.Processor.Output_Post_processor import Output_Post_processor
    from Question_Paper_Generator.PDF_Generator import PDF_Generator
    print("raw_Data Received from MAIN_CONTROLLER.py")
    DATA_FOR_USE = copy.deepcopy(DATA_FROM_MAIN_CONTROLLER)
    Pre_processed_Data,Data_only_for_Randomiser = Data_Pre_processor(DATA_FOR_USE)
    print("pre_processed_Data Received from Data_Pre_processor.py BY Main_Directory_Controller.py")
    Randomiser_key,set_code = Randomiser(Data_only_for_Randomiser)
    print("Randomiser_key and set_code Received from Randomiser.py BY Main_Directory_Controller.py")
    raw_output,Title_data = QPG(Pre_processed_Data,Randomiser_key)
    print("raw_output and Title_data Received from Question_Paper_Generator BY Main_Directory_Controller.py")
    Questions_for_pdf_generator,Answer_key =  Output_Post_processor(raw_output,set_code)
    print("Questions_for_pdf_generator and Answer_key Received from Output_Post_processor.py BY Main_Directory_Controller.py")
    Final_PDF_path = PDF_Generator(Questions_for_pdf_generator,Title_data)
    print("Final_PDF_path Received from PDF_Generator.py BY Main_Directory_Controller.py")
    return Final_PDF_path