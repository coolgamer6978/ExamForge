def data_pre_processor(raw_data):
    print("raw_data from MDC received by data_pre_processor.py")
    final_data = []
    for set_code,q_set in raw_data:
        answer_key = []
        for question in q_set:
            serial = question["serial"]
            if question["option1"][1]:
                answer_key.append([serial,1])
            elif question["option2"][1]:
                answer_key.append([serial,2])
            elif question["option3"][1]:
                answer_key.append([serial,3])
            elif question["option4"][1]:
                answer_key.append([serial,4])
        final_data.append({"set_code":set_code,"Answer_key":answer_key})
    return final_data

