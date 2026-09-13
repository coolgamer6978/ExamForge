from Archive.Archive_logic.Search_algorithm import Search_algorithm
from Archive.Archive_logic.Navigator import Navigator
def Main_Directory_Controller(data_from_MC,mode):
    print("search parameters received by Main Directory Controller.py")
    if mode == "Search":
        print("Data sent to Search_Algorithm.py by Main_Directory_Controller.py")
        matches = Search_algorithm(data_from_MC)
        return matches
    elif mode == "Navigation":
        print("path sent to Navigator.py by Main_Directory_Controller.py")
        data_inside = Navigator(data_from_MC)
        return data_inside