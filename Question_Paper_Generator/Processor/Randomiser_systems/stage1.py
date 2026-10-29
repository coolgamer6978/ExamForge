import random,json,time,os
def primary_spread_checker(Tn,s,ICP):
    Base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    UI = 100
    compiled_json = []
    Real_win = "None"
    for xyz in range(ICP):
        iterate = 0
        winner = []
        scores = []
        while True:
            TS =range(1,Tn+1)
            comparator = []
            S = s
            candidate = random.sample(TS,S)
            block_len = len(TS)//S
            index = -1
            block_use_keeper = {}
            #for proof concept not real score
            score = 1
            inverse_cnt = 0
            for i in range(S):
                temp_list = []
                while len(temp_list) < block_len:
                  index += 1
                  temp_list.append(TS[index])
                comparator.append(temp_list)
                block_use_keeper["block"+str(i)] = 0
            for index,certain_block in enumerate(comparator):
                set_certain_block = set(certain_block)
                block_use_keeper["block" + str(index)] = len(set_certain_block.intersection(candidate))
            #score sys pure proof of concept official score sys made later
            for key in block_use_keeper.keys():
                if block_use_keeper[key] == 0:
                    inverse_cnt += 1
            achieved_score = (S - inverse_cnt) * score
            store = {"candidate": candidate, "Block_wise_performance": block_use_keeper, "achieved_score": achieved_score}
            winner.append(store)
            #data insight/debug
            iterate = iterate + 1
            if iterate == UI:
                break
            scores.append(achieved_score)
        win = max([x["achieved_score"] for x in winner])
        for item in winner:
            if item["achieved_score"] == win:
                #print("winner-",item["candidate"],item["Block_wise_performance"],item["achieved_score"],sep="\n")
                Real_win = item["candidate"]
        avg_score = sum(scores) / len(scores)
        for_json = {"Run_id":xyz,"Total_candidates":len(scores),"Average score": avg_score,"Highest score": max(scores),
                    "Lowest score": min(scores),"Candidates scoring 42 or higher": sum(s >= 42 for s in scores),
                    "Candidates scoring above avg": sum(s >= avg_score for s in scores),
                    "winner": Real_win,"Tn":list(TS)}
        compiled_json.append(for_json)
    with open(os.path.join(Base_dir,"Question_Paper_Generator","Processor","Randomiser_systems","Regenerator","best_candidates.json"), "w") as outfile:
        json.dump(list(compiled_json_good["winner"] for compiled_json_good in compiled_json),outfile,indent=4)
    value_to_send = list(enumerate(list(compiled_json_good["winner"] for compiled_json_good in compiled_json),start=1))
    return value_to_send