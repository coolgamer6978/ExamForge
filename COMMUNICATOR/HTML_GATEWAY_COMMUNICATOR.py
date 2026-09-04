#region Imports
import flask
from flask import render_template
from werkzeug.serving import make_server
from MAIN_CONTROLLER import Main_Controller
#endregion
#region Flask object,server e.t.c creation
web = flask.Flask(__name__)
server = make_server(host="0.0.0.0",port=5000,app=web,threaded=True)
request = flask.request
#endregion
#region Listenter+EXECUTER
#Loads home page
@web.route('/')
def home_page():
    print("Server started and home page loaded")
    return render_template("examforge_frontend.html")
#Receives data from QPG and forwards it to MAIN_CONTROLLER.py
@web.route('/Question-paper-generator-python-data-sending-gateway',methods=['POST'])
def Raw_data():
    print("Raw_data received by HTML_GATEWAY_COMMUNICATOR")
    question_paper_raw_data = request.json
    Main_Controller(question_paper_raw_data,"QPG")#QPG = question paper generator
    return ""
#Verifies that server is active to Website
@web.route('/validation',methods=['GET'])
def validation():
    return "YES"
#endregion
server.serve_forever()#starts server