import time
import requests
import ssl
from tasks import status


BASE_URL = "https://localhost:443/"

if __name__ == "__main__":

    response = requests.get(BASE_URL)
    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    context = context.load_cert_chain()
    response = requests.get("https://192.168.178.27:4000", verify=context)
    #ds = status.device_status()
    #ds.start_update()
    #time.sleep(30)
    print(response.text)