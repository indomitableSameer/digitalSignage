import time
import requests
from tasks import status

BASE_URL = "http://localhost:8000/device"


response = requests.get(BASE_URL)
ds = status.device_status()
ds.start_update()
#time.sleep(30)
print(response.text)