from datetime import datetime, time, date
import logging, json
import globalVariables as gv
import time
import appdb as appdb
import secure_conn as secure_conn
from httpStatus import HttpStatus

_start_date = datetime.strptime("01-01-2023", "%d-%m-%Y").date()
_end_date = datetime.strptime("01-01-2500", "%d-%m-%Y").date()
_start_time = datetime.strptime("00:00:00", "%H:%M:%S").time()
_end_time = datetime.strptime("00:00:00", "%H:%M:%S").time()

def maintainPlaySchedule(log:logging):
    while True:
        try:
            log.info("waiting on play_schedule_event 30 sec..")
            if gv.play_sched_event.wait(30) == True:
                _getScheduleFromServer(log)
                gv.play_sched_event.clear()

            if gv.cloud_sync_ok_event.wait(60) == True:
                log.info("checking play schedule in db..")
                sched_details = appdb.getPlayScheduleFromDb()
                global _start_date, _start_time
                global _end_date, _end_time
                log.info("found schedule in db " + sched_details.start_date +"-"+ sched_details.end_date +", "+ sched_details.start_time +"-"+ sched_details.end_time)
                _start_date = datetime.strptime(sched_details.start_date, "%d-%m-%Y").date()
                _end_date = datetime.strptime(sched_details.end_date, "%d-%m-%Y").date()
                _start_time = datetime.strptime(sched_details.start_time, "%H:%M").time()
                _end_time = datetime.strptime(sched_details.end_time, "%H:%M").time()
                if date.today() >= _start_date and date.today() <= _end_date:
                    if datetime.now().time() >= _start_time and datetime.now().time() <= _end_time:
                        if gv.schedule_active.is_set() == False: 
                            log.info("setting schedule active event..")
                            gv.schedule_active.set()
                    elif gv.schedule_active.is_set() == True:
                        log.info("clearing schedule inactive event due to out of time..")
                        gv.schedule_active.clear()
                elif gv.schedule_active.is_set() == True:
                    log.info("clearing schedule inactive event due to out of date..")
                    gv.schedule_active.clear()
                time.sleep(60)
        except Exception as e:
            log.error(e)
            gv.play_sched_event.clear()
            time.sleep(60)

def _getScheduleFromServer(log:logging):
    global _start_date, _start_time
    global _end_date, _end_time

    conn_details = appdb.getConnDetailsFromDb()
    reg_details = appdb.getRegistrationDetailsFromDb()
    play_sched_details = appdb.getPlayScheduleFromDb()
    if reg_details.reg_id != None:
        log.info("sending getSchedule request..")

        connection = secure_conn.getConnection(conn_details.service_url, int(conn_details.service_port))
        connection.connect()
        
        headers = {'Content-type': 'application/json'}
        req = {"RegistrationId": reg_details.reg_id}
        connection.request("GET", "/device/getPlaySchedule", json.dumps(req), headers)    
        response = connection.getresponse()

        if response.status != HttpStatus.OK:
            log.warning("getSehedule failed. resonse->" + str(response.status))
            connection.close()
            return

        body = json.loads(response.read().decode())
        log.info("getPlaySchedule response : " + json.dumps(body))
        schedule_id = body['ScheduleId']
        if len(schedule_id) != 0:
            if len(body['StartDate']) !=0 and len(body['EndDate']) !=0:
                _start_date = datetime.strptime(body['StartDate'], "%d-%m-%Y").date()
                _end_date = datetime.strptime(body['EndDate'], "%d-%m-%Y").date()
                if len(body['StartTime']) !=0 and len(body['EndTime']) !=0:
                    _start_time = datetime.strptime(body['StartTime'], "%H:%M").time()
                    _end_time = datetime.strptime(body['EndTime'], "%H:%M").time()
        
        appdb.InsertOrUpdatePlayScheduleInDb(play_sched_details.id, schedule_id, _start_date.strftime("%d-%m-%Y"), _end_date.strftime("%d-%m-%Y"), _start_time.strftime("%H:%M"), _end_time.strftime("%H:%M"))
        log.info("Schedule received: " + _start_date.strftime("%d-%m-%Y") + " - " + _end_date.strftime("%d-%m-%Y") + " " + _start_time.strftime("%H:%M") + " - " + _end_time.strftime("%H:%M"))
        connection.close()
        time.sleep(20)
