import configparser
import os

class AppConfiguration():
    def __init__(self):
        CONFIG_PATH = './app.ini'
        self.registered = False
        self.reg_url = 'device.dss.com'
        self.reg_port = 4001
        self.reg_id = ''
        self.backend_url = 'device.dss.com'
        self.backend_port = 4001
        self.content_file = ''
        self.content_filepath = ''
        self.content_fileid = ''
        self.content_version = ''
        self.Timezone = ''
        if os.path.isfile(CONFIG_PATH) != True:
            self.write_config(CONFIG_PATH)
        self.read_config(CONFIG_PATH)

    def read_config(self, path):
        config = configparser.ConfigParser()
        config.read(path)
        self.registered = config['DEFAULT'].getboolean('Registered')
        self.Timezone = config['DEFAULT']['Timezone']
        self.reg_url = config['registration.server']['url']
        self.reg_port = 4001 if config['registration.server']['port'] == '' else int(config['registration.server']['port'])
        self.backend_url = config['backend.service']['url']
        self.backend_port = 4001 if config['backend.service']['port'] == '' else int(config['backend.service']['port'])
        self.reg_id = config['backend.service']['systemid']
        self.content_file = config['content']['file']
        self.content_filepath = config['content']['filepath']
        self.content_fileid = config['content']['fileid']
        self.content_version = config['content']['version']

    def update_config(self):
        self.write_config()
        self.read_config()

    def write_config(self, path):
        config = configparser.ConfigParser()
        config.read(path)
        config['DEFAULT']['Registered'] = 'yes' if self.registered else 'no'
        # config['DEFAULT']['Timezone'] = self.Timezone
        # config['registration.server']['url'] = self.reg_url
        # config['registration.server']['port'] = self.reg_port
        # config['backend.service']['url'] = self.backend_url
        # config['backend.service']['port'] = self.backend_port 
        # config['backend.service']['systemid'] = self.reg_id
        # config['content']['file'] = self.content_file
        # config['content']['filepath'] = self.content_filepath
        # config['content']['fileid'] = self.content_fileid
        # config['content']['version'] = self.content_version

        with open('/home/pi/digitalSignage/device/app/app.ini', 'w') as configfile:
            config.write(configfile)

AppConfig = AppConfiguration()


# def read_config():
#     config = configparser.ConfigParser()
#     config.read("/home/pi/digitalSignage/device/app/app.ini")
#     AppConfig.registered = config['DEFAULT'].getboolean('Registered')
#     AppConfig.Timezone = config['DEFAULT']['Timezone']
#     AppConfig.reg_url = config['registration.server']['url']
#     AppConfig.reg_port = 4001 if config['registration.server']['port'] == '' else int(config['registration.server']['port'])
#     AppConfig.backend_url = config['backend.service']['url']
#     AppConfig.backend_port = 4001 if config['backend.service']['port'] == '' else int(config['backend.service']['port'])
#     AppConfig.reg_id = config['backend.service']['systemid']
#     AppConfig.content_file = config['content']['file']
#     AppConfig.content_filepath = config['content']['filepath']
#     AppConfig.content_fileid = config['content']['fileid']
#     AppConfig.content_version = config['content']['version']
#     return AppConfig

# def update_config(config):
#     write_config(config)
#     read_config()

# def write_config(config):
#     with open('/home/pi/digitalSignage/device/app/app.ini', 'w') as configfile:
#         config.write(configfile)
