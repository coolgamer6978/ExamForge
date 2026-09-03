import flask
from flask import render_template
from werkzeug.serving import make_server
from MAIN_CONTROLLER import Main_Controller
web = flask.Flask(__name__)
server = make_server(host="0.0.0.0",port=5000,app=web,threaded=True)
request = flask.request
@web.route('/')
def home_page():
    print("Server started and home page loaded")
    return render_template("examforge_frontend.html")
@web.route('/Question-paper-generator-python-data-sending-gateway',methods=['POST'])
def Raw_data():
    print("Raw_data received")
    question_paper_raw_data = request.json
    Main_Controller(question_paper_raw_data)
    return ""
server.serve_forever()