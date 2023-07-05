import requests
import logging
import threading
import time

class device_status:
    def __init__(self):
        self.thread = threading.Thread(target=self.thread_status_update, daemon=False)

    def start_update(self):
        logging.log(1, 'starting device status thread')
        self.thread.start()

    def thread_status_update(self):
        while(True):
            res = requests.post('http://localhost:8000/device/register', data={'status':'online'})
            print(res)
            time.sleep(5)
