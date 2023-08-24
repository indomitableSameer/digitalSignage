import json
import logging

import M2Crypto
from configManager import AppConfiguration


class StatusUpdateRequest:
    def __init__(self, config:AppConfiguration):
        self.Id = config.reg_id
        self.Mac = "ab.ac.ad.a.af"
        self.App_Version = "1.1"
        self.Os_Version = "6.1.21-v8+"

def updateDeviceStatusToCloud(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    if config.registered == True:
        connection.connect()
        log.info("sending registration request..")
        headers = {'Content-type': 'application/json'}
        
        connection.request("PUT", "/status", json.dumps(StatusUpdateRequest(config).__dict__), headers)    
        response = connection.getresponse()
        log.info("Status Update: server response code -> " + str(response.status))
        #body = json.loads(response.read().decode())
        #connection.close()
        #log.info("registration response -->" + json.dumps(body))