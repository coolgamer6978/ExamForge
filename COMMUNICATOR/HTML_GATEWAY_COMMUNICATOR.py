#region Imports
import flask
from flask import render_template
from werkzeug.serving import make_server
from MAIN_CONTROLLER import Main_Controller
import os
#endregion
#region file setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(BASE_DIR,"Archive","storage","Custom"), exist_ok=True)
#endregion
#region Flask object,server e.t.c creation
web = flask.Flask(__name__)
server = make_server(host="0.0.0.0",port=5000,app=web,threaded=True)
request = flask.request
#endregion
#region Listenter+EXECUTER
#Loads home page
@web.route('/',methods=['GET'])
def home_page():
    print("Server started and home page loaded")
    return render_template("Home_page.html")
#Loads QPG page
@web.route('/QPG',methods=['GET'])
def QPG_page():
    print("QPG loaded")
    return render_template("QPG.html")
#Receives data from QPG and forwards it to MAIN_CONTROLLER.py
@web.route('/Question-paper-generator-python-data-sending-gateway',methods=['POST'])
def Raw_data():
    print("Raw_data received by HTML_GATEWAY_COMMUNICATOR")
    question_paper_raw_data = request.json
    list_of_paths = Main_Controller(question_paper_raw_data,"QPG")
    return flask.jsonify(list_of_paths)
#Sends files from Archive to Website
@web.route('/Dowload/<path:path>',methods=['GET'])
def Dowload(path):
    path = path.replace("/", "\\")
    print("Dowload request received from HTML_GATEWAY_COMMUNICATOR for "+path)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
    requested_pdf_path = os.path.join(archive_dir, path)
    print("Requested path:", requested_pdf_path)
    return flask.send_file(requested_pdf_path)
#Receives Custom Answer key from website and forwards to AKU
@web.route('/Answer-Key-Uploader-python-data-sending-gateway',methods=['POST'])
def Answer_key_raw_data():
    print("Custom Answer Key received by HTML_GATEWAY_COMMUNICATOR")
    custom_answer_key_raw_data = request.json
    Main_Controller(custom_answer_key_raw_data,"AKU")
    return ""
#Verifies that the user requested test series,set code and answer key exists through ASC.
@web.route('/Answer-sheet-checker-verify-python-data-sending-gateway',methods=['POST'])
def Answer_sheet_checker_verifier():
    print("Answer key identifier received by HTML_GATEWAY_COMMUNICATOR")
    verify = request.json
    reply = Main_Controller(verify,"ASC_verify")
    return reply
#Receives Checking data from website and forwards to ASC.
@web.route('/Answer-sheet-checker-data-python-data-sending-gateway',methods=['POST'])
def Answer_sheet_checker():
    print("Checking data received by HTML_GATEWAY_COMMUNICATOR")
    check = request.json
    result = Main_Controller(check,"ASC")
    return result
#Receives Search parameters
@web.route('/Archive/search-result',methods=['POST'])
def Archive_search():
    print("Search parameters received by HTML_GATEWAY_COMMUNICATOR")
    parameters = request.json
    result = Main_Controller(parameters,"Archive_search")
    return result
#Archive Navigation Handler
@web.route('/Archive/storage',methods=['GET'])
def Archive_home_page():
    print("Archive home page load was detected by HTML_GATEWAY_COMMUNICATOR")
    return Main_Controller(["storage"],"Archive_storage")
@web.route('/Archive/storage/<Run_ID>',methods=['GET'])
def Archive_Run_ID_page(Run_ID):
    print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
    return Main_Controller(["storage",Run_ID],"Archive_Run_ID")
@web.route('/Archive/storage/<Run_ID>/<Test_series_name>',methods=['GET'])
def Archive_Test_series_name_page(Run_ID,Test_series_name):
    print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
    return Main_Controller(["storage",Run_ID,Test_series_name],
                           "Archive_Test_series_name")
@web.route('/Archive/storage/<Run_ID>/<Test_series_name>/<Set_code>',methods=['GET'])
def Archive_Set_code_page(Run_ID,Test_series_name,Set_code):
    print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
    return Main_Controller(["storage",Run_ID,Test_series_name,Set_code],
                           "Archive_Set_code")
@web.route('/Archive/storage/<Run_ID>/<Test_series_name>/<Set_code>/<file_name>',methods=['GET'])
def Archive_file_name_page(Run_ID,Test_series_name,Set_code,file_name):
    print("Archive Run_ID page load was detected by HTML_GATEWAY_COMMUNICATOR")
    file_path = os.path.join(BASE_DIR,"Archive","storage",Run_ID,Test_series_name,Set_code,file_name)
    return flask.send_file(file_path)
#Verifies that server is active to Website
@web.route('/validation',methods=['GET'])
def validation():
    return "YES"
#endregion
server.serve_forever()#starts server
