import threading
from Archive.Archive_logic.Search_algorithm import Search_algorithm
from Archive.Archive_logic.Navigator import Navigator
def Main_Directory_Controller(data_from_MC,mode):
    Archive_MDC_lock = threading.Lock()
    with Archive_MDC_lock:
        print("search parameters received by Main Directory Controller.py")
        if mode == "Search":
            print("Data sent to Search_Algorithm.py by Main_Directory_Controller.py")
            matches = Search_algorithm(data_from_MC,"normal")
            return matches
        if mode == "Search_QPG":
            print("Data sent to Search_Algorithm.py by Main_Directory_Controller.py")
            matches = Search_algorithm(data_from_MC,"QPG")
            return matches
        if mode == "Search_ASC":
            print("Data sent to Search_Algorithm.py by Main_Directory_Controller.py")
            matches = Search_algorithm(data_from_MC,"ASC")
            return matches
        elif mode == "Navigation":
            print("path sent to Navigator.py by Main_Directory_Controller.py")
            data_inside = Navigator(data_from_MC)
            print("search result sent to MainController.py")
            return data_inside