from Question_Paper_Generator.Processor.Randomiser_systems.stage1 import primary_spread_checker
def set_splitter(Tn,S,ICP,C):
    #const
    Total_number_of_questions_in_the_bank = Tn
    number_question_in_a_set =S
    number_of_candidates = ICP
    number_of_column = C
    #var
    split_row_candidate = []
    split_row= []
    compiled_broken_set = []
    broken_set = []
    #Data extraction
    candidates = primary_spread_checker(Total_number_of_questions_in_the_bank,number_question_in_a_set,number_of_candidates)
    candidates_set = candidates
    #Row splitter
    for index,candidate in enumerate(candidates_set):
        split_row.append(candidate)
        if (index+1)%number_of_column == 0 or index+1 == len(candidates_set):
            split_row_candidate.append(split_row)
            split_row = []
    #Broken set gen
    for index_row,row in enumerate(split_row_candidate):
        for index_item,item in enumerate(row):
            broken_set.append(item)
            try:
                right_adjacent = row[index_item+1]
                broken_set.append(right_adjacent)
            except IndexError:
                pass
            try:
                if index_item == 0:
                    pass
                else:
                    left_adjacent = row[index_item-1]
                    broken_set.append(left_adjacent)
            except IndexError:
                pass
            try:
                down_adjacent = split_row_candidate[index_row+1][index_item]
                broken_set.append(down_adjacent)
            except IndexError:
                pass
            try:
                if index_row == 0:
                    pass
                else:
                    up_adjacent = split_row_candidate[index_row-1][index_item]
                    broken_set.append(up_adjacent)
            except IndexError:
                pass
            try:
                down_right_adjacent = split_row_candidate[index_row+1][index_item+1]
                broken_set.append(down_right_adjacent)
            except IndexError:
                pass
            try:
                if index_item == 0:
                    pass
                else:
                    down_left_adjacent = split_row_candidate[index_row+1][index_item-1]
                    broken_set.append(down_left_adjacent)
            except IndexError:
                pass
            try:
                if index_row == 0:
                    pass
                else:
                    up_right_adjacent = split_row_candidate[index_row-1][index_item+1]
                    broken_set.append(up_right_adjacent)
            except IndexError:
                pass
            try:
                if index_row == 0 or index_item == 0:
                    pass
                else:
                    up_left_adjacent = split_row_candidate[index_row-1][index_item-1]
                    broken_set.append(up_left_adjacent)
            except IndexError:
                pass
            compiled_broken_set.append(broken_set)
            broken_set = []
    return compiled_broken_set