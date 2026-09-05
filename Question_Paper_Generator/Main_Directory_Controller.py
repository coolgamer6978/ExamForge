def Main_Directory_Controller(DATA_FROM_MAIN_CONTROLLER):
    import copy
    from Processor.Data_Pre_processor import Data_Pre_processor
    from Processor.Randomiser import Randomiser
    from Processor.Question_Paper_Generator import QPG
    print("Data Received from MAIN_CONTROLLER.py")
    DATA_FOR_USE = copy.deepcopy(DATA_FROM_MAIN_CONTROLLER)
    Pre_processed_Data,Data_only_for_Randomiser = Data_Pre_processor(DATA_FOR_USE)
    Randomiser_key = Randomiser(Data_only_for_Randomiser)
    raw_output = QPG(Pre_processed_Data,Randomiser_key)