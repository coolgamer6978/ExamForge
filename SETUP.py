import os,json,subprocess,sys

normal = None
key = None
useable_address = None
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
mkcert_dir = os.path.join(BASE_DIR,"mkcert")
mkcert_files = os.path.join(mkcert_dir,"mkcert.exe")
#Dependency download
subprocess.run([sys.executable,"-m","pip","install","-r","requirements.txt"],
               check=True,
               cwd=BASE_DIR)
subprocess.run([mkcert_files,"-install"],
               cwd=mkcert_dir,
               check=True)
output = subprocess.run(["ipconfig"],
                        cwd=BASE_DIR,
                        capture_output=True,
                        text=True,
                        check=True)
for line in output.stdout.splitlines():
    if "IPv4 Address" in line:
        value = line.split(":")
        useable_address = value[1].strip()
subprocess.run([mkcert_files,str(useable_address),"localhost"],
               check=True,
               cwd=mkcert_dir)
mkcert_file = os.listdir(os.path.join(BASE_DIR,"mkcert"))
for file in mkcert_file:
    if file.endswith(".pem"):
        if file.endswith("-key.pem"):
            key = file
        else:
            normal = file
mkcert_value = {"normal":normal,"key":key,"Address_to_main_server":"https://"+str(useable_address)+":5000","Address_to_dependency_server":"http://"+str(useable_address)+":5001"}
with open(os.path.join(BASE_DIR,"start_up.json"),"w") as file:
    json.dump(mkcert_value,file)
#set up dir/file creator
os.makedirs(os.path.join(BASE_DIR,"Archive","storage"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR,"Archive","storage","Custom"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR,"Archive","storage","Result_Cache"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR,"zip_download_temp_handler"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR,"FILE_lock"), exist_ok=True)
with open(os.path.join(BASE_DIR,"Answer_Sheet_Checker","counter.json"),"w") as file:
    json.dump([0],file)
with open(os.path.join(BASE_DIR,"Archive","storage","metadata.json"),"w") as file:
    json.dump({"Run_ID": [],"Test_series": [],"set_code": [],"File_name": []},file)
with open(os.path.join(BASE_DIR,"FILE_lock","metadata.json.lock"),"w") as file:
    pass
#os.remove(os.path.join(BASE_DIR,"SETUP.py"))