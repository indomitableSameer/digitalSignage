# importing time and vlc
import asyncio
import configparser
import time
import logging
import threading
from player.vlcplayer import *
import deviceRegistration as deviceRegistration
import secure_conn as secure_conn
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

logFile = 'dss_player.log'
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')

my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=5*1024*1024, backupCount=2, encoding=None, delay=0)

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

async def main():
	app_log.info('dss node app stating..')
	#player_thread = vlcplayer(app_log, "./media/vv.mp4")
	#app_log.info('starting vlc player thread..')
	#player_thread.start()
	#app_log.debug("other work")
	#player_thread.join(timeout=None)
	#registerDevice(c.get_channel())
	#read_reg_config()
	conn = secure_conn.getConnection()
	deviceRegistration.registerDevice(app_log, conn)
	print(deviceRegistration.reg_state.status)
	if deviceRegistration.reg_state.status == True:
		player_thread = vlcplayer(app_log, "./media/vv.mp4")
		app_log.info('starting vlc player thread..')
		player_thread.start()
		app_log.debug("other work")
	time.sleep(300)


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())