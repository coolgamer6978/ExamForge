def Output_Post_processor(Processed_Data,set_code):
    Post_processed_Data = []
    c1 = 0
    o_set = Processed_Data[0]
    print(Processed_Data)
    print(o_set)
    for o_set_question in o_set:
        o_set_question["option1"] = o_set_question["option1"][0]
        o_set_question["option2"] = o_set_question["option2"][0]
        o_set_question["option3"] = o_set_question["option3"][0]
        o_set_question["option4"] = o_set_question["option4"][0]
    Post_processed_Data.append({"set_code": set_code[0], "question_set": Processed_Data[0]})
    for q_set in Processed_Data[1:]:
        print(q_set)
        c = 0
        c1 += 1
        for question in q_set:
            c += 1
            question["serial"] = c
            question["option1"] = question["option1"][0]
            question["option2"] = question["option2"][0]
            question["option3"] = question["option3"][0]
            question["option4"] = question["option4"][0]
        Post_processed_Data.append({"set_code":set_code[c1],"question_set":q_set})
    return Post_processed_Data
