import json
import multiprocessing
import threading
import zymkey
import time
import appdb as appdb
from httpStatus import HttpStatus
import secure_conn as secure_conn
from enum import Enum

class OperationMode(Enum):
    Service = 0
    Maintenance = 1

class TemperDetect():

    def __init__(self):
        self.process = None

    def runTemperDetect(self):
        try:
            zymkey.client.wait_for_perimeter_event(-1)
            print("temper detected")
            #zymkey.client.clear_perimeter_detect_info()
            # AT this point notify to system
        except SystemExit:
            # dont do anything
            pass


    #temperWatchdogThread = threading.Thread(target=runTemperDetect, args=(), daemon=False, name="temperWatchdog thread")
    #process = multiprocessing.Process(target=runTemperDetect, args=())

    def configureTemperDetect(self, mode):
        if mode == OperationMode.Maintenance:
            if self.process != None and self.process.is_alive():
                print("stoping thread in maintenence mode")
                self.process.terminate()
                self.process = None
            zymkey.client.set_perimeter_event_actions(0, action_notify=False, action_self_destruct=False)
            zymkey.client.set_perimeter_event_actions(1, action_notify=False, action_self_destruct=False)  

        elif mode == OperationMode.Service:
            print(mode)
            zymkey.client.set_perimeter_event_actions(0, action_notify=True, action_self_destruct=False)
            zymkey.client.set_perimeter_event_actions(1, action_notify=True, action_self_destruct=False)
            zymkey.client.clear_perimeter_detect_info()
            print("starting thread in service mode")
            if self.process == None:
                self.process = multiprocessing.Process(target=self.runTemperDetect, args=())
                self.process.start()

def getServiceMode(td):
    print("calling get service mode")
    td.configureTemperDetect(OperationMode.Maintenance)
    # conn_details = appdb.getConnDetailsFromDb()
    # connection = secure_conn.getConnection(conn_details.service_url, int(conn_details.service_port))
    # connection.connect()
    # headers = {'Content-type': 'application/json'}
    # connection.request("GET", "/getOperationMode", headers)    
    # response = connection.getresponse()

    # if response.status != HttpStatus.OK:
    #     connection.close()
    #     return

    # body = json.loads(response.read().decode())
    # if body["maintenance"] == "true":
    #     configureTemperDetect(OperationMode.Maintenance)
    # else:
    #     configureTemperDetect(OperationMode.Service)

td = TemperDetect()
timer = threading.Timer(20, getServiceMode, args=(td,))

def main():
    print("staring main")
    td.configureTemperDetect(OperationMode.Service)
    #configureTemperDetect(OperationMode.Service)
    timer.start()
    time.sleep(40)
    td.configureTemperDetect(OperationMode.Service)
    time.sleep(40)

if __name__ == "__main__":
	main()
