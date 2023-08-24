import configparser


class AppConfiguration():
    def __init__(self):
        self.registered = False
        self.reg_url = ''
        self.reg_port = 0
        self.reg_id = ''
        self.backend_url = ''
        self.backend_port = ''
        
AppConfig = AppConfiguration()


def read_config():
    config = configparser.ConfigParser()
    config.read("/home/pi/digitalSignage/device/app/app.ini")
    AppConfig.registered = config['DEFAULT'].getboolean('Registered')
    AppConfig.reg_url = config['registration.server']['url']
    AppConfig.reg_port = int(config['registration.server']['port'])
    AppConfig.backend_url = config['backend.service']['url']
    AppConfig.backend_port = int(config['backend.service']['port'])
    AppConfig.reg_id = config['backend.service']['systemid']
    return AppConfig

def write_config(config):
    with open('/home/pi/digitalSignage/device/app/app.ini', 'w') as configfile:
        config.write(configfile)