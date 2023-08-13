# importing time and vlc
import asyncio
import time
import logging
import threading
from player.vlcplayer import *
from channel import channel
from registerDevice import registerDevice
from logging.handlers import RotatingFileHandler

logFile = 'dss_player.log'
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')

my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=5*1024*1024, backupCount=2, encoding=None, delay=0)

my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.DEBUG)

app_log = logging.getLogger('root')
app_log.setLevel(logging.DEBUG)

app_log.addHandler(my_handler)

async def main():
	app_log.info('dss player stating..')
	#player_thread = vlcplayer(app_log, "./media/vv.mp4")
	#app_log.info('starting vlc player thread..')
	#player_thread.start()
	#app_log.debug("other work")
	#player_thread.join(timeout=None)
	c = channel(app_log, "device.dss.com:4001", "./pki/device-cert.pem", "./pki/client-key.pem", "./pki/ca-cert.pem")
	await registerDevice(c.get_channel())
	#registerDevice(c.get_channel())
	#time.sleep(500)

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
