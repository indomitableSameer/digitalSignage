from datetime import datetime, time, date
import logging, json
from configManager import AppConfiguration
import globalVariables as gv
import time, M2Crypto

start_date = datetime.strptime("15:09:2023", "%d:%m:%Y").date()
end_date = datetime.strptime("18:09:2023", "%d:%m:%Y").date()
start_time = datetime.strptime("00:12", "%H:%M").time()
end_time = datetime.strptime("00:14", "%H:%M").time()

def maintainPlaySchedule(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    while True:
        try:
            # for now get the schedule every 30 sec, but this should be imporved.
            _getScheduleFromServer(log, config, connection)
            if date.today() >=  start_date or date.today() <= end_date:
                if datetime.now().time() >= start_time and datetime.now().time() <= end_time:
                    log.info("setting schedule active event..")
                    gv.schedule_active.set()
                else:
                    log.info("clearing schedule inactive event..")
                    gv.schedule_active.clear()
            else:
                log.info("clearing schedule inactive event..")
                gv.schedule_active.clear()
            time.sleep(30)
        except Exception as e:
            log.error(e)

def _getScheduleFromServer(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    if config.registered == True:
        connection.connect()
        log.info("sending getSchedule request..")
        headers = {'Content-type': 'application/json'}
                    
        connection.request("PUT", "/getSchedule", json.dumps({'RegistrationId':config.reg_id}), headers)    
        response = connection.getresponse()
        response.read()
        log.info("Status Update: server response code -> " + str(response.status))
        connection.close()
        time.sleep(20)