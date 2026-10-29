import time,os,copy,random,json
from threading import Timer
from queue import Empty
from multiprocessing import Event,Queue,Process
from collections import Counter
from Question_Paper_Generator.Processor.Randomiser_systems.stage3 import penalty_checker
#worker guide
def main_work(load, command_channel, result_channel, m1_flag, m2_flag, m3_flag,
              m4_flag, commit_flag, SHUTDOWN_flag, prep, m3_check_queue,
              Total_number_of_questions_in_the_bank, number_question_in_a_set, number_of_candidates, number_of_column,FC):
    def mode1(w1):
        lowest = min(w1["score"])
        actual = w1["part"][w1["score"].index(lowest)][0]
        return actual, w1["score"]
    def mode2(w2, ignore):
        buff = []
        for info in w2["part"]:
            if info[0] == ignore:
                continue
            buff.extend(info[1])
        union = set(buff)
        left_over = set(range(1, Total_number_of_questions_in_the_bank + 1)).difference(union)
        if len(left_over) >= len(w2["part"][0][1]):
            pass
        else:
            least_freq = Counter(buff).most_common()[::-1]
            for add in least_freq:
                left_over.add(add[0])
                if len(left_over) >= len(w2["part"][0][1]):
                    break
        return left_over
    def mode3(w3, id, change):
        trial = copy.deepcopy(w3)
        affected_set = list(candidate[0] for candidate in trial["part"]).index(id)
        # change
        trial["part"][affected_set][1].clear()
        trial["part"][affected_set][1].extend(change)
        # prep for stage 3
        part_to_send = [list(trial["part"])]
        result = penalty_checker(Total_number_of_questions_in_the_bank, number_question_in_a_set, number_of_candidates,
                                 number_of_column, "worker_call", part_to_send)
        send = mode1(result[0])
        return send[1]
    def mode4(w4, id, apply):
        ID = list(xD[0] for xD in w4["part"]).index(id)
        w4["part"][ID][1].clear()
        w4["part"][ID][1].extend(apply)
        # ready for stage 3
        part_to_send = [list(w4["part"])]
        result = penalty_checker(Total_number_of_questions_in_the_bank, number_question_in_a_set, number_of_candidates,
                                 number_of_column, "worker_call", part_to_send)
        w4["score"] = result[0]["score"]
    while True:
        # MODE1 coordination
        compiled_lowest = []
        compiled_score = []
        for part_work in load:
            lowest, score = mode1(part_work)  # mode1 only accepts data in {"part":(...),"score":[...]}
            # scores can be turned to 1 list as the main coordinator will just extend them all anyway as it will take TRUE avg
            compiled_score.extend(score)
            if sum(score) / len(score) < FC:
                # lowest can also be turned to 1 list as main coordinator checks the total frequency so all will be added anyway
                compiled_lowest.append(lowest)
        result_channel.put((compiled_lowest, compiled_score))
        prep.set()
        # parked
        while True:
            if m1_flag.is_set():
                break
            if SHUTDOWN_flag.is_set():
                return
        # MODE2 coordination
        compiled_left_over = set([])
        try:
            exchange = command_channel.get(timeout=0.1)
        except Empty:
            if SHUTDOWN_flag.is_set():
                return
        for part_work in load:
            ids_in_current = list(check[0] for check in part_work["part"])
            if exchange in ids_in_current:
                score_of_exchange_in_current = part_work["score"][ids_in_current.index(exchange)]
                if score_of_exchange_in_current < FC:
                    left_over = mode2(part_work, exchange)
                    compiled_left_over.update(left_over)
        result_channel.put(compiled_left_over)
        while True:
            # parked
            while True:
                if m2_flag.is_set():
                    break
                if SHUTDOWN_flag.is_set():
                    return
            # MODE3 coordination
            compiled_check_score = []
            being_used = []
            try:
                ID_receive, change_receive = command_channel.get()
            except Empty:
                if SHUTDOWN_flag.is_set():
                    return
            for index, part_work in enumerate(load):
                ids_in_current = list(check[0] for check in part_work["part"])
                if ID_receive in ids_in_current:
                    being_used.append(index)
                    change_score_send = mode3(part_work, ID_receive, change_receive)
                    compiled_check_score.extend(change_score_send)
            for index, part_work in enumerate(load):
                if index not in being_used:
                    least, score = mode1(part_work)
                    compiled_check_score.extend(score)
            result_channel.put((ID_receive, change_receive, compiled_check_score))
            # parked
            while True:
                if m3_flag.is_set():
                    break
                if SHUTDOWN_flag.is_set():
                    return
            m3_check_queue.put("m3 = true seen")
            if commit_flag.is_set():
                # MODE4 coordination
                try:
                    ID_receive, change_receive = command_channel.get()
                except Empty:
                    if SHUTDOWN_flag.is_set():
                        return
                for part_work in load:
                    ids_in_current = list(check[0] for check in part_work["part"])
                    if ID_receive in ids_in_current:
                        mode4(part_work, ID_receive, change_receive)
                break
        while True:
            if m4_flag.is_set():
                break
            if SHUTDOWN_flag.is_set():
                return
        if SHUTDOWN_flag.is_set():
            return
# constants
def stage4 (Tn,S,N,C,D):
    print("Entered stage4")
    Base_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
    Total_number_of_questions_in_the_bank = Tn
    number_question_in_a_set = S
    number_of_candidates = N
    number_of_column = C
    Cutoff = 82
    M = D #(can max go from 0 to 4)
    #final cutoff
    FC = Cutoff + 4*M
    # time limit
    time_limit = 120 + 120 * M  # 2min,4min,6min,8mins,10mins)
    #data extraction
    raw_data = penalty_checker(Total_number_of_questions_in_the_bank,number_question_in_a_set,number_of_candidates,number_of_column,"normal",None)
    def distribution(r_d,workers):
        work_load = []
        representer = []
        mirror_represent = []
        v_rev = []
        amount = []
        #id for broken sets (b_s)
        for index,value in enumerate(r_d):
            representer.append((index,len(value["part"])))
            v_rev.append(len(value["part"]))
        u_v_rev = sorted(v_rev,reverse=True)
        for i in range(workers):
            amount.append([])
        #round 1
        for represent in amount:
            if u_v_rev:
                highest = u_v_rev[0]
                represent.append(highest)
                mirror_represent.append(highest)
                u_v_rev.remove(highest)
            else:
                break
        #left over
        for value in u_v_rev:
            lowest = min(mirror_represent)
            index = mirror_represent.index(lowest)
            mirror_represent[index] = lowest+value
            amount[index].append(value)
        #actual index
        for work in amount:
            need = []
            for load in work:
                for lookup in representer:
                    if lookup[1] == load:
                        need.append(r_d[lookup[0]])
                        representer.remove(lookup)
                        break
            if need:
                work_load.append(need)
        return work_load
    def updater(id,apply):
        #updates the sets
        part_to_send = []
        for w in raw_data:
            try:
                ID = list(xD[0] for xD in w["part"]).index(id)
            except ValueError:
                continue #this w doesnt contain the list that will be changed
            w["part"][ID][1].clear()
            w["part"][ID][1].extend(apply)
            # ready for stage 3
            part_to_send.append(copy.deepcopy(list(w["part"])))
        result = penalty_checker(Total_number_of_questions_in_the_bank, number_question_in_a_set, number_of_candidates,
                                 number_of_column, "worker_call", part_to_send)
        for w in raw_data:
            try:
                useless = list(xD[0] for xD in w["part"]).index(id)
            except ValueError:
                continue #this w doesnt contain the list that will be changed
            for res in result:
                if res["part"] == w["part"]:
                    w["score"] = res["score"]
                    break
    # set_up
    m1_flag = Event()
    m2_flag = Event()
    m3_flag = Event()
    m4_flag = Event()
    commit_flag = Event()
    SHUTDOWN_flag = Event()
    #timeout setup
    time_out = Timer(time_limit, SHUTDOWN_flag.set)
    reason = "Time out"+" Ran for "+str(time_limit)+" seconds"
    time_out.daemon = True
    #time start
    time_out.start()
    #check total cores
    cores = os.cpu_count()
    #cores = 2
    use_core = cores-1 #to exclude current main process
    if use_core > len(raw_data):
        use_core = len(raw_data)
    #workload generator
    work_load = distribution(raw_data,use_core)
    #channel creator
    command_channels = []
    for i in range(use_core):
        command_channel = Queue()
        command_channels.append(command_channel)
    result_channel = Queue()
    m3_check_queue = Queue()
    #process set up
    call_book = []
    #set up confirm
    set_up_confirm = [Event() for iterate in range(use_core)]
    for setup in range(use_core):
        p = Process(target=main_work,args=(work_load[setup],command_channels[setup],result_channel,m1_flag,m2_flag,m3_flag,m4_flag,commit_flag,SHUTDOWN_flag,set_up_confirm[setup],m3_check_queue,Tn,S,N,C,FC))
        call_book.append(p)
    #start up
    for worker in call_book:
        worker.start()
    #MAIN coordinator logic
    #wait till all worker fully set up
    for x in set_up_confirm:
        x.wait()
    while not SHUTDOWN_flag.is_set():
        #check for pass
        total_pass = []
        for broken_set in raw_data:
            avg_score = sum(broken_set["score"])/len(broken_set["score"])
            total_pass.append(avg_score)
        if all(score >= FC for score in total_pass):
            SHUTDOWN_flag.set()
            reason = "satisfying set found"
            break
        #phase1
        lowest_freq = []
        avg_ts = []
        for i in range(use_core):
            while not SHUTDOWN_flag.is_set():
                try:
                    packed = result_channel.get(timeout=0.1)
                    lowest,score = packed
                    lowest_freq.extend(lowest)
                    avg_ts.extend(score)
                    break
                except Empty:
                    if SHUTDOWN_flag.is_set():
                        break
                    else:
                        continue
                except ValueError as e:
                    if SHUTDOWN_flag.is_set():
                        break
                    else:
                        raise ValueError ("ERROR check line 315") from e
        if SHUTDOWN_flag.is_set():
            break
        worst_set = Counter(lowest_freq).most_common(1)[0][0]
        STORE_avg_TS = sum(avg_ts)/len(avg_ts)
        #send command for m2
        for command in command_channels:
            command.put(worst_set)
        # clean old flag
        m4_flag.clear()
        #allow to start m2
        m1_flag.set()
        #phase2
        dream_set = set([])#DO NOT CLEAR until confirmed next cycle began
        for i in range(use_core):
            while not SHUTDOWN_flag.is_set():
                try:
                    want = result_channel.get(timeout=0.1)
                    dream_set.update(want)
                    break
                except Empty:
                    if SHUTDOWN_flag.is_set():
                        break
                    else:
                        continue
                except ValueError:
                    if SHUTDOWN_flag.is_set():
                        break
                    else:
                        raise ValueError ("ERROR check line 341")
        if SHUTDOWN_flag.is_set():
            break
        saved_refer = list(dream_set)
        while not SHUTDOWN_flag.is_set():
            trial_sample = random.sample(saved_refer,number_question_in_a_set)
            chosen_set = worst_set
            #send command for m3
            for command in command_channels:
                command.put((chosen_set,trial_sample))
            # stop stale flag
            m1_flag.clear()
            m3_flag.clear()
            #allow to start m3
            m2_flag.set()
            #phase3
            trial_avg_ts = []
            for i in range(use_core):
                while not SHUTDOWN_flag.is_set():
                    try:
                        packed = result_channel.get(timeout=0.1)
                        trial_id,trial_change,score = packed
                        trial_avg_ts.extend(score)
                        break
                    except Empty:
                        if SHUTDOWN_flag.is_set():
                            break
                        else:
                            continue
                    except ValueError:
                        if SHUTDOWN_flag.is_set():
                            break
                        else:
                            raise ValueError ("ERROR check line 380")
            if SHUTDOWN_flag.is_set():
                continue
            trial_avg_ts = sum(trial_avg_ts)/len(trial_avg_ts)
            commit = False
            if trial_avg_ts > STORE_avg_TS:
                #COMMIT
                for command in command_channels:
                    command.put((trial_id,trial_change))
                commit_flag.set()
                commit = True
            # stop stale flag
            m2_flag.clear()
            #allow to go past m3
            m3_flag.set()
            for i in range(use_core):
                while not SHUTDOWN_flag.is_set():
                    try:
                        discard = m3_check_queue.get(timeout=0.1)
                        break
                    except Empty:
                        continue
                    except ValueError:
                        if SHUTDOWN_flag.is_set():
                            continue
                        else:
                            raise ValueError ("ERROR check line 415")
            if commit:
                break
        #post phase3
        if commit and not SHUTDOWN_flag.is_set():
            updater(trial_id,trial_change)
            normalised = []
            de_duped = []
            re_arranged = []
            save_able = []
            current = 1
            for item in list(normal["part"] for normal in raw_data):
                normalised.extend(item)
            for i in normalised:
                if i not in de_duped:
                    de_duped.append(i)
            while len(re_arranged) < number_of_candidates:
                for check in de_duped:
                    if check[0] == current:
                        re_arranged.append(check)
                        current +=1
            for clean in re_arranged:
                save_able.append(clean[1])
            with open (os.path.join(Base_DIR,"Question_Paper_Generator","Processor","Randomiser_systems","Regenerator",
                                    "best_candidates.json"), "w") as file:
                json.dump(save_able,file,indent=2)
        # clean old flag
        m3_flag.clear()
        commit_flag.clear()
        #allow next cycle to begin
        m4_flag.set()
    #stop
    for worker in call_book:
        worker.join()
    #after done
    print("finished due to>>>>",reason)
    with open (os.path.join(Base_DIR,"Question_Paper_Generator","Processor","Randomiser_systems","Regenerator",
                            "best_candidates.json"), "r") as file:
        selected = json.load(file)
    return
