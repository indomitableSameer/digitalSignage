import uuid

def get_mac_address():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join([mac[i:i+2] for i in range(0, 12, 2)])