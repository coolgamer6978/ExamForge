def Output_Post_processor(Processed_Data,set_code):
    COMPILED_Answerkey = []
    Post_processed_Data = []
    c1 = -1
    o_set_Answer_key = []
    o_set_question = Processed_Data[0][0]
    print(Processed_Data)
    print(o_set_question)
    if o_set_question["option1"][1]:
        o_set_Answer_key.append((o_set_question["serial"], 1))
    elif o_set_question["option2"][1]:
        o_set_Answer_key.append((o_set_question["serial"], 2))
    elif o_set_question["option3"][1]:
        o_set_Answer_key.append((o_set_question["serial"], 3))
    elif o_set_question["option4"][1]:
        o_set_Answer_key.append((o_set_question["serial"], 4))
    o_set_question["option1"] = o_set_question["option1"][0]
    o_set_question["option2"] = o_set_question["option2"][0]
    o_set_question["option3"] = o_set_question["option3"][0]
    o_set_question["option4"] = o_set_question["option4"][0]
    COMPILED_Answerkey.append({"set_code": "0000", "Answer_key": o_set_Answer_key})
    Post_processed_Data.append({"set_code": "0000", "question_set": Processed_Data[0]})
    for q_set in Processed_Data[1:]:
        print(q_set)
        c = 0
        c1 += 1
        Answer_key = []
        for question in q_set:
            c += 1
            question["serial"] = c
            if question["option1"][1]:
                Answer_key.append((c,1))
            elif question["option2"][1]:
                Answer_key.append((c,2))
            elif question["option3"][1]:
                Answer_key.append((c,3))
            elif question["option4"][1]:
                Answer_key.append((c,4))
            question["option1"] = question["option1"][0]
            question["option2"] = question["option2"][0]
            question["option3"] = question["option3"][0]
            question["option4"] = question["option4"][0]
        COMPILED_Answerkey.append({"set_code":set_code[c1],"Answer_key":Answer_key})
        Post_processed_Data.append({"set_code":set_code[c1],"question_set":q_set})
    return Post_processed_Data,COMPILED_Answerkey
