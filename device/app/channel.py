import grpc

class channel():
    def __init__(self, logging, serverUrl, clientPubKey, clientPrivateKey, caRootCert):
        self.logging = logging
        self.serverUlr = serverUrl
        self.rootCert = caRootCert
        self.cPubKey = clientPubKey
        self.cPriKey = clientPrivateKey
    
    def get_channel(self):
        print("going to connect")
        ccert = open(self.cPubKey, "rb").read()
        ckey = open(self.cPriKey, "rb").read()
        rootca = open(self.rootCert, "rb").read()
        sslcreds = grpc.ssl_channel_credentials(rootca, ckey, ccert)
        print("cred done")
        return grpc.secure_channel(target=self.serverUlr, credentials=sslcreds)
        #print("secure channel done")
        #stub = deviceRegistration_pb2_grpc.DeviceRegistrationStub(grpcchannel)
        #print("got stub")
        
        #response = stub.RegisterDevice(deviceRegistration_pb2.DeviceRegistrationRequest(device_mac_add="test1", device_unique_id="test1", fw_version="test1", os_version="test1"))
        #print(response)
