import json
import time,copy
from Question_Paper_Generator.Processor.Randomiser_systems.stage2 import set_splitter
def penalty_checker(Tn,S,N,C,mode,payload):
    # constants
    Total_number_of_questions_in_the_bank = Tn
    number_question_in_a_set = S
    number_of_candidates = N
    number_of_column = C
    base_score = 100
    base_penalty_for_total_question_overlap = -1
    weighted_penalty_for_total_question_overlap = (base_penalty_for_total_question_overlap) * (
                Total_number_of_questions_in_the_bank / (number_question_in_a_set ** 2))
    penalty_for_positional_overlap = -1
    block_chunk = 10
    # Var
    Compiled_score_db = []
    # data extraction
    if mode == "normal":
        candidates_list = set_splitter(Total_number_of_questions_in_the_bank, number_question_in_a_set,
                                   number_of_candidates, number_of_column)
    elif mode == "worker_call":
        candidates_list = payload
    else:
        raise ValueError("Mode must be either 'normal' or 'worker_call'")
    for candidates in candidates_list:
        candidates_set = list((candidate[0],set(candidate[1])) for candidate in candidates)
        number_of_candidates = len(candidates_set)
        # vars
        common_values_set_compiled = []
        ICP_wide_penalty_db = []
        ICP_wide_Score_db = []
        list_of_sets = []
        list_of_TS = []
        broken_set = copy.deepcopy(candidates)
        for iterate in range(number_of_candidates):
            set_current_candidate = candidates_set[iterate]
            set_penalty = []
            common_values_set = []
            for check in range(number_of_candidates):
                if check == iterate:
                    continue
                set_cross_check_candidates = candidates_set[check]
                common = set_current_candidate[1].intersection(set_cross_check_candidates[1])
                penalty_for_one_set = len(common) * weighted_penalty_for_total_question_overlap
                set_penalty.append(penalty_for_one_set)
                common_values_set.append({"index": check, "common": common})
            total_penalty = sum(set_penalty)
            ICP_wide_penalty_db.append({"candidate_id": iterate, "penalty": total_penalty})
            common_values_set_compiled.append({"candidate_id": iterate, "common": common_values_set})
        # calculation of penalty_for_positional_overlap
        for instance in common_values_set_compiled:
            Current_candidate = candidates[instance["candidate_id"]]
            if len(Current_candidate[1]) % block_chunk == 0:
                C = 0
            else:
                C = 1
            if len(Current_candidate[1]) >= block_chunk:
                net_iterate = block_chunk + C
                block_len = len(Current_candidate[1]) // block_chunk
            else:
                net_iterate = len(Current_candidate[1])
                block_len = 1
            index = -1
            list_of_blocks_for_current_candidate = []
            for i in range(net_iterate):
                temp_list = []
                if C == 0:
                    while len(temp_list) < block_len:
                        index += 1
                        temp_list.append(Current_candidate[1][index])
                elif C == 1:
                    if i < block_chunk:
                        while len(temp_list) < block_len:
                            index += 1
                            temp_list.append(Current_candidate[1][index])
                    elif i == block_chunk:
                        if len(Current_candidate[1]) % block_chunk != 0:
                            temp_list.extend(Current_candidate[1][index + 1:])
                list_of_blocks_for_current_candidate.append(temp_list)
            set_wise_penalty = []
            for check in instance["common"]:
                c_use_n = candidates[check["index"]]
                cross_check_candidates = (c_use_n[0],c_use_n[1])
                if len(cross_check_candidates[1]) % block_chunk == 0:
                    C = 0
                else:
                    C = 1
                if len(Current_candidate[1]) >= block_chunk:
                    net_iterate = block_chunk + C
                    block_len = len(Current_candidate[1]) // block_chunk
                else:
                    net_iterate = len(Current_candidate[1])
                    block_len = 1
                index = -1
                list_of_blocks_for_cross_check_candidate = []
                for i in range(net_iterate):
                    temp_list = []
                    if C == 0:
                        while len(temp_list) < block_len:
                            index += 1
                            temp_list.append(cross_check_candidates[1][index])
                    elif C == 1:
                        if i < block_chunk:
                            while len(temp_list) < block_len:
                                index += 1
                                temp_list.append(cross_check_candidates[1][index])
                        elif i == block_chunk:
                            if len(cross_check_candidates[1]) % block_chunk != 0:
                                temp_list.extend(cross_check_candidates[1][index + 1:])
                    list_of_blocks_for_cross_check_candidate.append(temp_list)
                q_penalty_for_one_set = []
                for Question in check["common"]:
                    index1 = None
                    index2 = None
                    for index, i1 in enumerate(list_of_blocks_for_current_candidate):
                        if Question in i1:
                            found_current_candidate_block = index
                            break
                    for index, i2 in enumerate(list_of_blocks_for_cross_check_candidate):
                        if Question in i2:
                            found_cross_check_candidate_block = index
                            break
                    penalty_mult = (2 - (0.5 * abs(found_current_candidate_block - found_cross_check_candidate_block)))
                    if abs(found_current_candidate_block - found_cross_check_candidate_block) == 0:
                        for index, locate1 in enumerate(
                                list_of_blocks_for_current_candidate[found_current_candidate_block]):
                            if locate1 == Question:
                                index1 = index
                        for index, locate2 in enumerate(
                                list_of_blocks_for_cross_check_candidate[found_cross_check_candidate_block]):
                            if locate2 == Question:
                                index2 = index
                        if index1 == index2:
                            penalty_mult = 4
                    if penalty_mult > 0:
                        penalty = penalty_for_positional_overlap * penalty_mult
                    else:
                        penalty = 0
                    q_penalty_for_one_set.append(penalty)
                P_for_one_set = sum(q_penalty_for_one_set)
                set_wise_penalty.append(P_for_one_set)
            total_penalty = sum(set_wise_penalty)
            for find in ICP_wide_penalty_db:
                if find["candidate_id"] == instance["candidate_id"]:
                    find["penalty"] += total_penalty
                    break
        # TS calc
        for instance in ICP_wide_penalty_db:
            ICP_wide_Score_db.append(
                {"candidate_id": instance["candidate_id"], "score": base_score + instance["penalty"]})
        # compiling data
        for data in ICP_wide_Score_db:
            index = data["candidate_id"]
            TS = data["score"]
            list_of_sets.append(broken_set[index])
            list_of_TS.append(TS)
        broken_set_prep = {"part":list_of_sets,"score":list_of_TS}
        Compiled_score_db.append(broken_set_prep)
    return Compiled_score_db