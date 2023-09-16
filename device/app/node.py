# importing time and vlc
import asyncio
import configparser
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
import deviceConfigManger

logFile = 'dss_player.log'
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')

my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=1*1024*1024, backupCount=2, encoding=None, delay=0)

my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.DEBUG)

app_log = logging.getLogger('root')
app_log.setLevel(logging.DEBUG)

app_log.addHandler(my_handler)

load_dotenv()

def read_reg_config():
    config = configparser.ConfigParser(interpolation=None)
    config.read("/home/pi/digitalSignage/device/app/app.ini")
    print(config['DEFAULT'].getboolean('Registered'))
    #print(config['registration.server']['Url'])
    #print(config['registration.server']['Port'])

def appThreads(config, conn):
	playSchedulerDemonThread = threading.Thread(target=playScheduler.maintainPlaySchedule, args=(app_log, config), daemon=False, name="Schedular thread")
	statusDeamonThread = threading.Thread(target=statusUpdate.updateDeviceStatusToCloud, args=(app_log, config, conn), daemon=False, name="statusThread")
	playSchedulerDemonThread.start()
	statusDeamonThread.start()

def main():
	app_log.info('dss node app stating..')
	appConfig = configManager.read_config()
	conn = secure_conn.getConnection()
	deviceRegistration.registerDevice(app_log, conn)
	print(deviceRegistration.reg_state.status)
	appConfig = configManager.read_config()
	if deviceRegistration.reg_state.status == True:
		player_thread = vlcplayer(app_log, "/home/pi/media/test.mp4")
		#contentHandler.getUpdatedContent(app_log, appConfig, conn)
		app_log.info('starting vlc player thread..')
		player_thread.start()
		appThreads(appConfig, conn)

if __name__ == "__main__":
    #asyncio.get_event_loop().run_until_complete(main())
    main()
