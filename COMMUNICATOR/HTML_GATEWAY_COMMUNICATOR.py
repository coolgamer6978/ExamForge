from flask import render_template
from werkzeug.serving import make_server
from MAIN_CONTROLLER import Main_Controller
import os,subprocess,threading,flask,json,shutil,time,datetime
from threading import Lock
#region file setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#mkcert
result = subprocess.check_output([os.path.join(BASE_DIR, "mkcert", "mkcert.exe"), "-CAROOT"],text=True).strip()
root_CA = os.path.join(result, "rootCA.pem")
with open(os.path.join(BASE_DIR,"start_up.json"),"r") as file:
    value_in_json = json.load(file)
    cert = value_in_json["normal"]
    key = value_in_json["key"]
#endregion
#region Flask object,server,thread e.t.c creation
web = flask.Flask(__name__)
dependency_web = flask.Flask(__name__)
server = make_server(host="0.0.0.0",port=5000,app=web,threaded=True,ssl_context=(
        os.path.join(BASE_DIR,"mkcert",cert),os.path.join(BASE_DIR,"mkcert",key)))
dependency_server = make_server(host="0.0.0.0",port=5001,app=dependency_web,threaded=True)
def dependency_server_start():
    print("Dependency server started")
    dependency_server.serve_forever()
dependency_thread = threading.Thread(target=dependency_server_start,daemon=True)
request = flask.request
#cleaner
def zip_cleaner():
    while True:
        time.sleep(300)
        check_presence_file = os.listdir(os.path.join(BASE_DIR, "zip_download_temp_handler"))
        if len(check_presence_file) != 0:
            for delete in check_presence_file:
                os.remove(os.path.join(BASE_DIR, "zip_download_temp_handler", delete))
                print(delete, "was removed")
zip_timer = threading.Thread(target=zip_cleaner, daemon=True)
Html_lock = Lock()
#endregion
#region Listenter+EXECUTER
#Loads Dependency home page
@dependency_web.route('/',methods=['GET'])
def dependency_home_page():
    print("Dependency_Home page loaded")
    return render_template("Dependency_Home_page.html")
#sends dependency
@dependency_web.route('/Dependency',methods=['GET'])
def dependency_downloader():
    with Html_lock:
        print("Dependency sent requested CA")
        return flask.send_file(root_CA)
#Loads home page
@web.route('/',methods=['GET'])
def home_page():
    print("Home page loaded")
    return render_template("Home_page.html")
#Loads QPG page
@web.route('/QPG',methods=['GET'])
def QPG_page():
    print("QPG loaded")
    return render_template("QPG.html")
#Loads ASC page
@web.route('/ASC',methods=['GET'])
def ASC_page():
    print("ASC loaded")
    return render_template("ASC.html")
#Loads AKU page
@web.route('/AKU',methods=['GET'])
def AKU_page():
    print("AKU loaded")
    return render_template("AKU.html")
#Loads Archive page
@web.route('/Archive',methods=['GET'])
def Archive_page():
    print("Archive loaded")
    return render_template("Archive.html")
#Receives data from QPG and forwards it to MAIN_CONTROLLER.py
@web.route('/Question-paper-generator-python-data-sending-gateway',methods=['POST'])
def Raw_data():
    with Html_lock:
        print("Raw_data received by HTML_GATEWAY_COMMUNICATOR")
        question_paper_raw_data = request.json
        if question_paper_raw_data["Paper_details"]["save"]:
            list_of_paths = Main_Controller(question_paper_raw_data,"QPG+SAVE")
        else:
            list_of_paths = Main_Controller(question_paper_raw_data, "QPG")
        del question_paper_raw_data["Paper_details"]["save"]
        return flask.jsonify(list_of_paths)
#Receives data from QPG_saved_viewer and forwards it to MAIN_CONTROLLER.py
@web.route('/Question-paper-generator-python-data-sending-gateway-for-saved-question-view',methods=['POST'])
def save():
    with Html_lock:
        print("saved_question_view request received BY HTML_GATEWAY_COMMUNICATOR")
        list_of_items = Main_Controller("","QPG_save")
        return flask.jsonify(list_of_items)
#Receives Search parameters from QPG
@web.route('/QPG/search-result',methods=['POST'])
def QPG_search():
    with Html_lock:
        print("Search parameters received by HTML_GATEWAY_COMMUNICATOR")
        parameters = request.json
        result = Main_Controller(parameters,"QPG_search")
        return flask.jsonify(result)
#Receives Json formating request from QPG
@web.route('/Question-paper-generator-python-data-sending-gateway-for-saved-question-search-addition',methods=['POST'])
def QPG_format():
    with Html_lock:
        print("Json formating request received by HTML_GATEWAY_COMMUNICATOR")
        parameters = request.json
        result = Main_Controller(parameters,"QPG_format")
        return flask.jsonify(result)
#Sends JSON to Website
@web.route('/JSON/<path:path>',methods=['GET'])
def JSON(path):
    with Html_lock:
        path = path.replace("Archive/storage/", "")
        path = path.replace("/", "\\")
        print("JSON request received from HTML_GATEWAY_COMMUNICATOR for "+path)
        archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
        requested_JSON_path = os.path.join(archive_dir, path)
        print("Requested path:", requested_JSON_path)
        with open(requested_JSON_path,"r") as file:
            data = json.load(file)
        return flask.jsonify(data)
#Sends files from Archive to Website
@web.route('/Dowload/<path:path>',methods=['GET'])
def Dowload(path):
    with Html_lock:
        path = path.replace("Archive/storage/", "")
        path = path.replace("/", "\\")
        print("Download request received from HTML_GATEWAY_COMMUNICATOR for "+path)
        archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
        requested_pdf_path = os.path.join(archive_dir, path)
        print("Requested path:", requested_pdf_path)
        return flask.send_file(requested_pdf_path,as_attachment=True)
#Sends dir from Archive to Website
@web.route('/Dowload-dir/<path:path>',methods=['GET'])
def Dowload_dir(path):
    with Html_lock:
        path = path.replace("Archive/storage/", "")
        path = path.replace("/", "\\")
        print("Download-zip request received from HTML_GATEWAY_COMMUNICATOR for "+path)
        archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
        requested_dir = os.path.join(archive_dir, path)
        zip_base = os.path.join(BASE_DIR,"zip_download_temp_handler","zip_download"+datetime.datetime.now().strftime("%Y%m%d%H%M%S%f"))
        zip_path = shutil.make_archive(zip_base, "zip", requested_dir)
        print("Requested path:", zip_path)
        return flask.send_file(zip_path,as_attachment=True)
#Receives Custom Answer key from website and forwards to AKU
@web.route('/Answer-Key-Uploader-python-data-sending-gateway',methods=['POST'])
def Answer_key_raw_data():
    with Html_lock:
        print("Custom Answer Key received by HTML_GATEWAY_COMMUNICATOR")
        custom_answer_key_raw_data = request.json
        Main_Controller(custom_answer_key_raw_data,"AKU")
        return "YES"
#Verifies that the user given name already exists.
@web.route('/Answer-key_uploader-verify-python-data-sending-gateway',methods=['POST'])
def Answer_Key_Uploader_verifier():
    with Html_lock:
        print("Answer key identifier received by HTML_GATEWAY_COMMUNICATOR")
        verify = request.json
        result = Main_Controller(verify[0],"AKU_verify")
        return result
#Receives data from ASC_test_series_viewer and forwards it to MAIN_CONTROLLER.py
@web.route('/Answer-sheet-checker-python-data-sending-gateway-for-Test-series-view',methods=['POST'])
def Test_series_view():
    with Html_lock:
        print("Test_series_view request received BY HTML_GATEWAY_COMMUNICATOR")
        list_of_items = Main_Controller("","ASC_Test_series_view")
        return flask.jsonify(list_of_items)
#Receives Search parameters from ASC
@web.route('/ASC/search-result',methods=['POST'])
def ASC_search():
    with Html_lock:
        print("Search parameters received by HTML_GATEWAY_COMMUNICATOR")
        parameters = request.json
        result = Main_Controller(parameters,"ASC_search")
        return flask.jsonify(result)
#Verifies that the user requested test series,set code and answer key exists through ASC.
@web.route('/Answer-sheet-checker-verify-python-data-sending-gateway',methods=['POST'])
def Answer_sheet_checker_verifier():
    with Html_lock:
        print("Answer key identifier received by HTML_GATEWAY_COMMUNICATOR")
        verify = request.json
        reply,num_of_ans = Main_Controller(verify,"ASC_verify")
        return flask.jsonify([reply,num_of_ans])
#Receives Checking data from website and forwards to ASC.
@web.route('/Answer-sheet-checker-data-python-data-sending-gateway',methods=['POST'])
def Answer_sheet_checker():
    with Html_lock:
        print("Checking data received by HTML_GATEWAY_COMMUNICATOR")
        check = request.json
        result,report = Main_Controller(check,"ASC")
        return flask.jsonify({"result":result,"pdf_path":report})
#Receives Search parameters
@web.route('/Archive/search-result',methods=['POST'])
def Archive_search():
    with Html_lock:
        print("Search parameters received by HTML_GATEWAY_COMMUNICATOR")
        parameters = request.json
        result = Main_Controller(parameters,"Archive_search")
        return flask.jsonify(result)
#Archive Navigation Handler
@web.route('/Archive/storage',methods=['GET'])
def Archive_home_page():
    with Html_lock:
        print("Archive home page load was detected by HTML_GATEWAY_COMMUNICATOR")
        return flask.jsonify(Main_Controller(["storage"],"Archive_storage"))
@web.route('/Archive/storage/<Run_ID>',methods=['GET'])
def Archive_Run_ID_page(Run_ID):
    with Html_lock:
        print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
        return flask.jsonify(Main_Controller(["storage",Run_ID],"Archive_Run_ID"))
@web.route('/Archive/storage/<Run_ID>/<Test_series_name>',methods=['GET'])
def Archive_Test_series_name_page(Run_ID,Test_series_name):
    with Html_lock:
        print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
        return flask.jsonify(Main_Controller(["storage",Run_ID,Test_series_name],
                               "Archive_Test_series_name"))
@web.route('/Archive/storage/<Run_ID>/<Test_series_name>/<Set_code>',methods=['GET'])
def Archive_Set_code_page(Run_ID,Test_series_name,Set_code):
    with Html_lock:
        print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
        return flask.jsonify(Main_Controller(["storage",Run_ID,Test_series_name,Set_code],
                               "Archive_Set_code"))
#Verifies that Main server is active to Website
@web.route('/validation',methods=['GET'])
def validation():
    return "YES"
#Verifies that Dependency server is active to Website
@dependency_web.route('/validation',methods=['GET'])
def validation():
    return "YES"
#endregion
print("link of Dependency website->",value_in_json["Address_to_dependency_server"])
print("link of Main website->",value_in_json["Address_to_main_server"])
print("Server started")
zip_timer.start()
dependency_thread.start()
server.serve_forever()#starts server
#FIX Search Algorithm ERROR and DUPLICATION in Archive 