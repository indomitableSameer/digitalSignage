import json
import logging
import time
import appUtils
import appdb as appdb
import globalVariables as gv
import secure_conn as secure_conn
from httpStatus import HttpStatus

class StatusUpdateRequest:
    def __init__(self, reg_id, sched_id, content_id):
        self.RegistrationId = reg_id
        self.ScheduleAllocId = sched_id
        self.ContentAllocId = content_id
        self.App_Version = appUtils.get_app_version()
        self.Os_Version = appUtils.get_os_version()
        self.IpAddr = appUtils.get_ip_addr()


def updateDeviceStatusToCloud(log:logging):
    while True:
        try:
            if gv.status_update_event.wait() == True:
                conn_details = appdb.getConnDetailsFromDb()
                reg_detail = appdb.getRegistrationDetailsFromDb()
                play_sched = appdb.getPlayScheduleFromDb()
                content_info = appdb.getContentInfoFromDb()

                if reg_detail.reg_id != None:
                    log.info("registration id found in db->" + reg_detail.reg_id)
                    connection = secure_conn.getConnection(conn_details.service_url, int(conn_details.service_port))
                    connection.connect()
                    msg = json.dumps(StatusUpdateRequest(reg_detail.reg_id, play_sched.schedule_id, content_info.content_id).__dict__)
                    log.info("sending status msg :" + msg)
                    headers = {'Content-type': 'application/json'}
                    connection.request("POST", "/statusUpdate", msg, headers)    
                    response = connection.getresponse()

                    if response.status == HttpStatus.CONFLICT:
                        log.info("Device is out of sync with cloud settings. Setting events for threads to sync")
                        gv.play_sched_event.set()
                        gv.content_event.set()
                    elif response.status == HttpStatus.OK:
                        log.info("status updated sucessfully. setting cloud_sync_ok_event..")
                        gv.cloud_sync_ok_event.set()
                    else:
                        log.info("failed to update status..")
                        gv.status_update_event.clear()
                        gv.play_sched_event.clear()
                        gv.schedule_active.clear()
                        gv.registration_event.set() 
                    connection.close()
                    time.sleep(30)   
                else:
                    log.info("updateDeviceStatusToCloud : reg found false. setting reg event to start work flow..")
                    gv.registration_event.set()
                    time.sleep(30)
        except Exception as e:
            log.critical("Exception in satus thread", e)
            time.sleep(30)
    
