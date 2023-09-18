from datetime import datetime, time, date
import logging, json
from configManager import AppConfiguration
import globalVariables as gv
import time, M2Crypto
import appUtils

_start_date = datetime.strptime("15:09:2023", "%d:%m:%Y").date()
_end_date = datetime.strptime("18:09:2500", "%d:%m:%Y").date()
_start_time = datetime.strptime("00:00", "%H:%M").time()
_end_time = datetime.strptime("00:00", "%H:%M").time()

class _GetScheduleResponse:
    def __init__():
        ScheduleId = ''
        StartData = ''
        EndDate = ''
        StartTime = ''
        EndTime = ''

def maintainPlaySchedule(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    while True:
        try:
            # for now get the schedule every 30 sec, but this should be imporved.
            _getScheduleFromServer(log, config, connection)
            if date.today() >=  _start_date or date.today() <= _end_date:
                if datetime.now().time() >= _start_time and datetime.now().time() <= _end_time:
                    log.info("setting schedule active event..")
                    gv.schedule_active.set()
                else:
                    log.info("clearing schedule inactive event..")
                    gv.schedule_active.clear()
            else:
                log.info("clearing schedule inactive event..")
                gv.schedule_active.clear()
        except Exception as e:
            log.error(e)
        time.sleep(30)

def _getScheduleFromServer(log:logging, config:AppConfiguration, connection:M2Crypto.httpslib.HTTPSConnection):
    global _start_date, _start_time
    global _end_date, _end_time
    if config.registered == True:
        connection.connect()
        log.info("sending getSchedule request..")
        headers = {'Content-type': 'application/json'}
        req = {"RegistrationId": config.reg_id}
        connection.request("GET", "/getPlaySchedule", json.dumps(req), headers)    
        response = connection.getresponse()

        if response.status != appUtils.HttpStatus.OK.value:
            log.warning("getSehedule failed. resonse->" + str(response.status))
            connection.close()

        body = json.loads(response.read().decode())
        print(body)

        if len(body['ScheduleId']) != 0:
            if len(body['StartDate']) !=0 and len(body['EndDate']) !=0:
                _start_date = datetime.strptime(body['StartDate'], "%d:%m:%Y").date()
                _end_date = datetime.strptime(body['EndDate'], "%d:%m:%Y").date()
                if len(body['StartTime']) !=0 and len(body['EndTime']) !=0:
                    _start_time = datetime.strptime(body['StartTime'], "%H:%M").time()
                    _end_time = datetime.strptime(body['EndTime'], "%H:%M").time()
        
        log.info("Schedule received: " + _start_date.strftime("%d:%m:%Y") + " - " + _end_date.strftime("%d:%m:%Y") + " " + _start_time.strftime("%H:%M") + " - " + _end_time.strftime("%H:%M"))
        connection.close()
        time.sleep(20)
