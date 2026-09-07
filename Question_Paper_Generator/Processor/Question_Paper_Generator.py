def QPG(PROCESSED_DATA_FROM_MDC,RANDOMISER_KEY):
    import copy
    print("Pre_Processed_Data and Randomiser_key Received from Main_Directory_Controller.py BY Question_Paper_Generator.py")
    Processed_data = []
    Title_data = PROCESSED_DATA_FROM_MDC["Paper_details"]
    O_SET = []
    for question in PROCESSED_DATA_FROM_MDC["Question_paper"]:
        editable_question_original = copy.deepcopy(question)
        O_SET.append(editable_question_original)
    Processed_data.append(O_SET)
    for current_set in RANDOMISER_KEY:
        N_set = []
        for Question in current_set:
            serial = Question[0]
            option = Question[1]
            canon_question_set = PROCESSED_DATA_FROM_MDC["Question_paper"]
            editable_question = copy.deepcopy(canon_question_set[serial-1])
            editable_question["option1"] = canon_question_set[serial-1]["option"+str(option[0])]
            editable_question["option2"] = canon_question_set[serial-1]["option" + str(option[1])]
            editable_question["option3"] = canon_question_set[serial-1]["option" + str(option[2])]
            editable_question["option4"] = canon_question_set[serial-1]["option" + str(option[3])]
            N_set.append(editable_question)
        Processed_data.append(N_set)
    return Processed_data,Title_data