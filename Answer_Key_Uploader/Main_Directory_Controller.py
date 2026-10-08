import threading
from Answer_Key_Uploader.Answer_key_writer import Answer_key_writer
from Answer_Key_Uploader.data_pre_processor import data_pre_processor
from Answer_Key_Uploader.verifier import verifier
def Main_Directory_Controller(raw_data,test_series_path_from_MC,mode):
    AKU_MDC_lock = threading.Lock()
    with AKU_MDC_lock:
        print("raw_Data Received from MAIN_CONTROLLER.py")
        if mode == "Internal":
            print("Answer_key and path sent to Answer_key_writer.py")
            Answer_keys = data_pre_processor(raw_data)
            Answer_key_writer(Answer_keys,test_series_path_from_MC,"Internal")
            print("Answer_key_writer_finished.")
            return
        elif mode == "External":
            print("Answer_key and path sent to Answer_key_writer.py")
            Answer_key_writer(raw_data,test_series_path_from_MC,"External")
            return
        elif mode == "verify":
            result = verifier(raw_data,test_series_path_from_MC)
            return result