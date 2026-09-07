#region Imports
import flask
from flask import render_template
from werkzeug.serving import make_server
from MAIN_CONTROLLER import Main_Controller
import os
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
    list_of_paths = Main_Controller(question_paper_raw_data,"QPG")#QPG = question paper generator
    return flask.jsonify(list_of_paths)
@web.route('/Dowload/<path>',methods=['GET'])
def Dowload(path):
    print("Dowload request received from HTML_GATEWAY_COMMUNICATOR for "+path)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    archive_dir = os.path.join(BASE_DIR, "Archive", "storage")
    requested_pdf_path = os.path.join(archive_dir, path)
    return flask.send_file(requested_pdf_path)
#Verifies that server is active to Website
@web.route('/validation',methods=['GET'])
def validation():
    return "YES"
#endregion
server.serve_forever()#starts server