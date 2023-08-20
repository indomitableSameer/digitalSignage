import json
import logging
import configparser
import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509

class DeviceRegisterRequest:
    def __init__(self):
        self.Mac = "12:11:11:11:11"
        self.IpAddr = "123.123.232.32"

#@dataclass
class RegistrationState():
    def __init__(self):
        self.status = False
        self.serverUrl = ''
        self.port = 0
        self.systemid = ''
        
reg_state = RegistrationState()

def read_config():
    config = configparser.ConfigParser()
    config.read("/home/pi/digitalSignage/device/app/app.ini")
    reg_state.status = config['DEFAULT'].getboolean('Registered')
    reg_state.serverUrl = config['registration.server']['Url']
    reg_state.port = int(config['registration.server']['Port'])
    return config

def write_config(config):
    with open('/home/pi/digitalSignage/device/app/app.ini', 'w') as configfile:
        config.write(configfile)
    

def registerDevice(log:logging , connection:M2Crypto.httpslib.HTTPSConnection):
    config = read_config()

    if reg_state.status == True :
        log.info("Device already registered.. checking other info")
        if reg_state.port !=0 and len(reg_state.serverUrl) != 0 :
            log.info("info stored in init " + reg_state.serverUrl +':'+ str(reg_state.port) + " looks okay. Not sending registration request..")
            return True
        
    log.info("sending registration request..")
    headers = {'Content-type': 'application/json'}
    connection.connect()
    connection.request("POST", "/register", json.dumps(DeviceRegisterRequest().__dict__), headers)    
    response = connection.getresponse()
    body = json.loads(response.read().decode())
    connection.close()
    log.info("closed connection! Going to entract and save info received..") 
    log.info("registration response -->" + json.dumps(body))
    if int(body['RegistrationStatus']) == 1 or int(body['RegistrationStatus']) == 2 :
        reg_state.serverUrl = config['backend.service']['Url'] = body['Backend_Server_url']
        reg_state.port = config['backend.service']['Port'] = str(4001)
        reg_state.systemid = config['backend.service']['SystemId'] = body['UniqueSystemId']
        config['DEFAULT']['registered'] = 'yes'
        write_config(config)
        reg_state.status = True
        return True
    else:
        return False
