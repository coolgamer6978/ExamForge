def Output_Post_processor(Processed_Data,set_code):
    COMPILED_Answerkey = []
    Post_processed_Data = []
    c1 = -1
    for q_set in Processed_Data:
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
