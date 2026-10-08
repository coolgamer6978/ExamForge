def Output_Post_processor(Processed_Data,set_code):
    Post_processed_Data = []
    c1 = 0
    o_set = Processed_Data[0]
    #indent for options
    indentA = " " * (len("A)")+1)
    indentB = " " * (len("B)")+1)
    indentC = " " * (len("C)")+1)
    indentD = " " * (len("D)")+1)
    for o_set_question in o_set:
        indent = " " * (len(str("Q" + str(o_set_question["serial"]))+". ")+4)
        o_set_question["option1"] = o_set_question["option1"][0]
        o_set_question["option2"] = o_set_question["option2"][0]
        o_set_question["option3"] = o_set_question["option3"][0]
        o_set_question["option4"] = o_set_question["option4"][0]
        o_set_question["question"] = o_set_question["question"].replace("\n","\n"+indent)
        o_set_question["option1"] = o_set_question["option1"].replace("\n","\n"+indentA)
        o_set_question["option2"] = o_set_question["option2"].replace("\n","\n"+indentB)
        o_set_question["option3"] = o_set_question["option3"].replace("\n","\n"+indentC)
        o_set_question["option4"] = o_set_question["option4"].replace("\n","\n"+indentD)
    Post_processed_Data.append({"set_code": set_code[0], "question_set": Processed_Data[0]})
    for q_set in Processed_Data[1:]:
        c = 0
        c1 += 1
        for question in q_set:
            c += 1
            question["serial"] = c
            indent = " " * (len("Q" + str(question["serial"]) + ". ")+3)
            question["option1"] = question["option1"][0]
            question["option2"] = question["option2"][0]
            question["option3"] = question["option3"][0]
            question["option4"] = question["option4"][0]
            question["question"] = question["question"].replace("\n","\n"+indent)
            question["option1"] = question["option1"].replace("\n","\n"+indentA)
            question["option2"] = question["option2"].replace("\n","\n"+indentB)
            question["option3"] = question["option3"].replace("\n","\n"+indentC)
            question["option4"] = question["option4"].replace("\n","\n"+indentD)
        Post_processed_Data.append({"set_code":set_code[c1],"question_set":q_set})
    return Post_processed_Data
