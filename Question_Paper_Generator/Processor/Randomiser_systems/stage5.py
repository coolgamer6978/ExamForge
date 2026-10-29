import random,os,json
from Question_Paper_Generator.Processor.Randomiser_systems.Regenerator.stage4 import stage4
def Randomiser(RAW_DATA_FROM_MDC):
    print("filtered_Data Received from Main_Directory_Controller.py BY stage5.py")
    Base_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    N,Tn,S,C,D = RAW_DATA_FROM_MDC
    #data extraction
    run = stage4(Tn,S,N,C,D)
    with open(os.path.join(Base_DIR,"Question_Paper_Generator","Processor","Randomiser_systems","Regenerator","best_candidates.json"),"r") as f:
        Final_Key = json.load(f)
    for q_set in Final_Key:
        c = -1
        for question in q_set:
            c+=1
            rand_option = random.sample(range(1,5),4)
            q_set[c] = (question,rand_option)
    set_code = [str(code) for code in random.sample(range(1000,10000),N)]
    set_code.insert(0,"0000")
    return Final_Key,set_code
