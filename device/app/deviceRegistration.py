from datetime import datetime
import json
import logging
import configparser
import time
import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509
import appUtils
import appdb as appdb
import globalVariables as gv
import secure_conn as secure_conn

class DeviceRegisterRequest:
    def __init__(self):
        self.Mac = appUtils.get_mac_address()
        self.IpAddr = appUtils.get_mac_address()

def registerDevice(log:logging):
    while True:
        try:
            log.info("waiting on reg event ")
            if gv.registration_event.wait() == True:
                reg_details = appdb.getRegistrationDetailsFromDb()
                conn_details = appdb.getConnDetailsFromDb()
                device_info = appdb.getDeviceInfoFromDb()

                log.info("sending registration request..")
                headers = {'Content-type': 'application/json'}
                connection = secure_conn.getConnection(conn_details.registration_url, int(conn_details.registration_port))
                connection.connect()
                connection.request("POST", "/registerDevice",
                                json.dumps(DeviceRegisterRequest().__dict__), headers)
                
                response = connection.getresponse()

                if response.status == 200:
                    body = json.loads(response.read().decode())   
                    log.info("registration response -->" + json.dumps(body))

                    if int(body['RegistrationStatus']) == 1 or int(body['RegistrationStatus']) == 2:               
                        service_url = body['ServiceUrl']
                        service_port = body['ServicePort']
                        reg_id = body['UniqueSystemId']
                        timzone = body['Timezone']
                        appdb.InsertOrUpdateDeviceInfoInDb(device_info.id, timzone)
                        appdb.InsertOrUpdateRegDetailsInDb(reg_details.id, reg_id)
                        appdb.InsertOrUpdateConnDetailsInDb(conn_details.id, conn_details.registration_url, conn_details.registration_port, service_url, service_port)
                        gv.registration_event.clear() # clear event as we are done with reg
                        gv.status_update_event.set() # clear event as we are done with reg
                    
                    log.info("closing connection..")
                    connection.close()
                else:
                    log.info("registration request failed." + str(response.status))
                    log.info("reason: " + response.reason)
                    connection.close()
                    time.sleep(30)
        except Exception as e:
            log.error(e)
            time.sleep(300)
