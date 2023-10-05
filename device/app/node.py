# importing time and vlc
import asyncio
import configparser
import os
import time
import logging
import threading
from vlcplayer import vlcplayer
import deviceRegistration as deviceRegistration
import statusUpdate as statusUpdate
import configManager as configManager
import contentHandler as contentHandler
import secure_conn as secure_conn
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
import globalVariables as gv
import playScheduler
import M2Crypto
import deviceConfigManger
import appdb as appdb

logFile = 'dss_player.log'
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')

my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=1*1024*1024, backupCount=2, encoding=None, delay=0)

my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.DEBUG)

app_log = logging.getLogger('root')
app_log.setLevel(logging.DEBUG)

app_log.addHandler(my_handler)

load_dotenv()

def appThreads():
	player_instance = vlcplayer(app_log, "./media/video.mp4")

	devRegDemonThread = threading.Thread(target=deviceRegistration.registerDevice, args=(app_log,), daemon=False, name="dev registration thread")
	mediaPlayerDemonThread = threading.Thread(target=player_instance.run, args=(), daemon=False, name="media player thread")
	playSchedulerDemonThread = threading.Thread(target=playScheduler.maintainPlaySchedule, args=(app_log,), daemon=False, name="Schedular thread")
	statusDeamonThread = threading.Thread(target=statusUpdate.updateDeviceStatusToCloud, args=(app_log,), daemon=False, name="status Thread")
	contentDeamonThread = threading.Thread(target=contentHandler.getUpdatedContent, args=(app_log,), daemon=False, name="contenthandler Thread")

	devRegDemonThread.start()
	mediaPlayerDemonThread.start()
	playSchedulerDemonThread.start()
	statusDeamonThread.start()
	contentDeamonThread.start()

def main():
	app_log.info('dss node app stating..')
	appThreads()
	#deviceRegistration.registerDevice(app_log, conn)
	#print(deviceRegistration.reg_state.status)
	#appConfig = configManager.read_config()	
	gv.registration_event.set()

if __name__ == "__main__":
	main()
