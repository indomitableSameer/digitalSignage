import json
import logging
import shutil
from time import sleep

import M2Crypto
from configManager import AppConfiguration


class ContentInfoRequest:
    def __init__(self, config:AppConfiguration):
        self.Id = config.reg_id
        #self.Fileinfo = 'v.mp4'

def getUpdatedContent(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    while True:
        try:
            if config.registered == True:
                log.info("sending content request request..")
                headers = {'Content-type': 'application/json'}
                connection.connect()
                connection.request("POST", "/content", json.dumps(ContentInfoRequest(config).__dict__), headers)    
                response = connection.getresponse()
                log.info("Status Update: server response code for content req -> " + str(response.status))
                #print(response.getheaders())
                if response.status == 200:
                    with open('test.mp4', 'wb') as out_file:
                        #print("going to read response")
                        while chunk := response.read(200):
                            #print(len(chunk))
                            #shutil.copy(chunk, out_file)
                            out_file.write(chunk)
                        #body = response.read()
                        #out_file.write(body)
                #print("going to close channel")
                connection.close()
                log.info("writing to file done.")
            sleep(600)
        except Exception as e:
            log.error(e)