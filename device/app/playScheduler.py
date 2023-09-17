from datetime import datetime, time, date
import logging
from configManager import AppConfiguration
import globalVariables as gv
import time

start_date = datetime.strptime("15:09:2023", "%d:%m:%Y").date()
end_date = datetime.strptime("18:09:2023", "%d:%m:%Y").date()
start_time = datetime.strptime("00:12", "%H:%M").time()
end_time = datetime.strptime("00:14", "%H:%M").time()

def maintainPlaySchedule(log:logging, config:AppConfiguration):
    while True:
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
