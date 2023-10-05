import uuid
import platform
from enum import Enum
_app_version = '1.0'

def get_app_version():
    return _app_version

def get_mac_address():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join([mac[i:i+2] for i in range(0, 12, 2)])

def get_os_version():
    return platform.system() + platform.release()