from datetime import datetime
import json
import logging
import time
import appUtils
import appdb as appdb
import globalVariables as gv
import secure_conn as secure_conn
from httpStatus import HttpStatus

class DeviceRegisterRequest:
    def __init__(self):
        self.Mac = appUtils.get_mac_address()
        self.IpAddr = appUtils.get_mac_address()

def registerDevice(log:logging):
    while True:
        try:
            log.info("waiting on reg event ")
            if gv.registration_event.wait(120) == True:
                reg_details = appdb.getRegistrationDetailsFromDb()
                conn_details = appdb.getConnDetailsFromDb()
                device_info = appdb.getDeviceInfoFromDb()

                log.info("sending registration request..")
                headers = {'Content-type': 'application/json'}
                connection = secure_conn.getConnection(conn_details.registration_url, int(conn_details.registration_port))
                connection.connect()
                connection.request("POST", "/registerDevice", json.dumps(DeviceRegisterRequest().__dict__), headers)
                response = connection.getresponse()

                if response.status == HttpStatus.OK: #if status is ok that means either registration is newly done or it was already done. In both case we dont care. 
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
                else: # connection was okay but status is not okay.. that means device is not allocated to any location. In this case we will stop all the threads and check after 2 min.
                    log.error("registration request failed." +", reason: " + response.reason + ", status code: " + str(response.status))
                    log.warning("stoping all running threads..")
                    connection.close()
                    gv.play_sched_event.clear()
                    gv.schedule_active.clear()
                    gv.cloud_sync_ok_event.clear()
                    gv.status_update_event.clear()
        except Exception as e:
            # if there is connection issue then wait for 5 min before retry
            # in this case threads are not stopped and if old content is scheduled can be active, keep it running..
            log.error(e)
            time.sleep(300)
