import uuid
import platform
import socket
import fcntl
import struct
_app_version = '1.0'

def get_app_version():
    return _app_version

def get_mac_address():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join([mac[i:i+2] for i in range(0, 12, 2)])

def get_os_version():
    return platform.system() + platform.release()

def get_pi_model():
    try:
        with open('/proc/cpuinfo', 'r') as cpuinfo:
            for line in cpuinfo:
                if line.startswith('Model'):
                    model = line.split(': ')[1].strip()
                    return model
        return "-"
    except IOError:
        return "Error"

def get_ip_addr(interface="wlan0"):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        ip_address = socket.inet_ntoa(fcntl.ioctl(
            sock.fileno(),
            0x8915,
            struct.pack('256s', bytes(interface[:15], 'utf-8'))
        )[20:24])
        return ip_address
    except IOError:
        return "Not available"