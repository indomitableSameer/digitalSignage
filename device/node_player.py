import time
import requests
import ssl
from tasks import status
import os


BASE_URL = "https://192.168.178.27:4000/"

if __name__ == "__main__":

    #response = requests.get(BASE_URL)
    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    context.verify_mode = ssl.CERT_REQUIRED
    context.load_verify_locations("/home/pi/zymkey_test_scripts/pki/ca-bundle.pem")
    context.load_cert_chain(certfile="/home/pi/zymkey_test_scripts/pki/tmp/c-cert.pem", keyfile="/home/pi/zymkey_test_scripts/pki/tmp/c-key.pem")
    response = requests.post("https://192.168.178.27:4000/", data={'status':'online'}, verify="/home/pi/zymkey_test_scripts/pki/ca-bundle.pem", auth=context)
    #ds = status.device_status()
    #ds.start_update()
    #time.sleep(30)
    print(response.text)