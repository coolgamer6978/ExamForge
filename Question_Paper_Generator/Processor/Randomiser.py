def Randomiser(RAW_DATA_FROM_MDC):
    import random
    import time
    import threading
    print("filtered_Data Received from Main_Directory_Controller.py BY Randomiser.py")
    def timer():
        t = 0
        while True:
            time_keeper.insert(0,t)
            time.sleep(30)
            t += 30
    timer_thread = threading.Thread(target=timer,daemon=True)
    time_keeper = [0]
    Randomsied_Question = []
    Final_Key = []
    Number_of_Copies,Number_of_Question = RAW_DATA_FROM_MDC
    timer_thread.start()
    while True:
        criteria = []
        Passed = True
        rand_instance = random.sample(range(1,Number_of_Question+1),Number_of_Question)
        for instance in Randomsied_Question:
            common = 0
            for compare in zip(instance,rand_instance):
                if compare[0]==compare[1]:
                    common+=1
            criteria.append(common)
        for check in criteria:
            if check <= 2 ** (time_keeper[0] // 30):
                Passed = True
            else:
                Passed = False
                break
        if Passed:
            Randomsied_Question.append(rand_instance)
        if len(Randomsied_Question)>=Number_of_Copies:
            break
    rand_sequence = random.sample(range(Number_of_Copies),Number_of_Copies)
    for instance in rand_sequence:
        Final_Key.append(Randomsied_Question[instance])
    for q_set in Final_Key:
        c = -1
        for question in q_set:
            c+=1
            rand_option = random.sample(range(1,5),4)
            q_set[c] = (question,rand_option)
    set_code = random.sample(range(1000,10000),Number_of_Copies)
    return Final_Key,set_code
