import json
import logging
from time import sleep

import M2Crypto
from configManager import AppConfiguration


class StatusUpdateRequest:
    def __init__(self, config:AppConfiguration):
        self.Id = config.reg_id
        self.Mac = "ab.ac.ad.a.af"
        self.App_Version = "1.1"
        self.Os_Version = "6.1.21-v8+"

def updateDeviceStatusToCloud(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    while True:
        if config.registered == True:
            connection.connect()
            log.info("sending registration request..")
            headers = {'Content-type': 'application/json'}
            
            connection.request("PUT", "/status", json.dumps(StatusUpdateRequest(config).__dict__), headers)    
            response = connection.getresponse()
            response.read()
            log.info("Status Update: server response code -> " + str(response.status))
            connection.close()
        sleep(20)