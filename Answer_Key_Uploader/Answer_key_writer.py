import os,json,portalocker
def Answer_key_writer(answer_key,path,mode):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    lock_path = os.path.join(BASE_DIR,"FILE_lock","metadata.json.lock")
    print("Answer_key_writer received required data to start")
    def meta_data(name,path):
        with portalocker.Lock(lock_path,timeout=None):
            with open(os.path.join(BASE_DIR,"Archive","storage","metadata.json"),"r") as file:
                metadata = json.load(file)
            metadata["File_name"].append({name:path})
            with open(os.path.join(BASE_DIR,"Archive","storage","metadata.json"),"w") as file:
                json.dump(metadata,file,indent=4)
            return
    if mode == "Internal":
        for Answer_key_set in answer_key:
            SET = Answer_key_set["set_code"]
            final_path = os.path.join(path,str(SET))
            save = os.path.join(final_path,"Answer_key.json")
            with open(save,"w") as file:
                json.dump(Answer_key_set,file)
            meta_data("Answer_key",save)
        return
    elif mode == "External":
        save = os.path.join(path,str(answer_key[0]).strip().replace(" ","_")+".json")
        with open(save,"w") as file:
            json.dump(answer_key[1],file)
        meta_data(answer_key[0],save)
        return
