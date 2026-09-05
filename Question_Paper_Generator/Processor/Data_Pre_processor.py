def Data_Pre_processor(DATA_FROM_MDC):
    def clean_data(raw_data):
        error = []
        DEBUG_DATA = []
        Questions = raw_data["Question_paper"]
        for Question in Questions:
            if 0 in (len(Question["question"]),len(Question["option1"]),len(Question["option2"]),
                     len(Question["option3"]),len(Question["option4"]),len(Question["answer"])) or Question["answer"] not in ("1","2","3","4"):
                error.append(Question)
            else:
                continue
        for fix in error:
            waste = Questions.pop(Questions.index(fix))
            DEBUG_DATA.append(waste)
        for removed in DEBUG_DATA:
            print(removed,"was removed due to being invalid")
        return
    def seperate_data_for_Randomiser(Processed_data):
        total_number_of_questions = len(Processed_data["Question_paper"])
        total_number_of_copies_needed = Processed_data["Paper_details"]["studentCount"]
        data_pack_for_randomiser = (total_number_of_copies_needed,total_number_of_questions)
        return data_pack_for_randomiser
    def Final_processed_data(Processed_data):
        Questions = Processed_data["Question_paper"]
        for Question in Questions:
            ANS = Question["answer"]
            if ANS == "1":
                Question["option1"] = (Question["option1"],True)
                Question["option2"] = (Question["option2"],False)
                Question["option3"] = (Question["option3"],False)
                Question["option4"] = (Question["option4"],False)
            elif ANS == "2":
                Question["option1"] = (Question["option1"], False)
                Question["option2"] = (Question["option2"], True)
                Question["option3"] = (Question["option3"], False)
                Question["option4"] = (Question["option4"], False)
            elif ANS == "3":
                Question["option1"] = (Question["option1"], False)
                Question["option2"] = (Question["option2"], False)
                Question["option3"] = (Question["option3"], True)
                Question["option4"] = (Question["option4"], False)
            elif ANS == "4":
                Question["option1"] = (Question["option1"], False)
                Question["option2"] = (Question["option2"], False)
                Question["option3"] = (Question["option3"], False)
                Question["option4"] = (Question["option4"], True)
            del Question["answer"]
        return
    clean_data(DATA_FROM_MDC)
    Final_processed_data(DATA_FROM_MDC)
    Data_packet_for_Randomiser = seperate_data_for_Randomiser(DATA_FROM_MDC)
    return DATA_FROM_MDC, Data_packet_for_Randomiser