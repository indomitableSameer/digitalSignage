import grpc


import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509

#ssl_enigne = M2Crypto.Engine.load_dynamic_engine('pkcs11', "/usr/lib/aarch64-linux-gnu/engines-1.1/zymkey_ssl.so")
ssl_enigne = M2Crypto.Engine.Engine('pkcs11')
print("engine initalizing..")
ssl_enigne.init()
print("engine initalized:" + ssl_enigne.get_name())
print("engine id:" + ssl_enigne.get_id())

ssl_context = M2Crypto.SSL.Context('tls')
ssl_context.set_verify(mode=M2Crypto.SSL.verify_peer | M2Crypto.SSL.verify_fail_if_no_peer_cert, depth=1)

ssl_context.load_verify_locations("/home/pi/ca-cert.pem")
pkey = ssl_enigne.load_private_key("pkcs11:model=SoftHSM%20v2;manufacturer=SoftHSM%20project;serial=6b307d0622b88e72;token=device;id=%74%F2%CD%F0%0F%CA%09%4A%0C%61%31%6C%0F%DD%CD%7E%AE%42%08%3C;object=zymkeyrsa;type=private", "1234")
M2Crypto.m2.ssl_ctx_use_pkey_privkey(ssl_context.ctx, pkey.pkey)
print(pkey.pkey)

ccert = open("/home/pi/device-rsa-cert.pem", "rb").read()
x509_cert = M2Crypto.X509.load_cert_string(ccert)
M2Crypto.m2.ssl_ctx_use_x509(ssl_context.ctx, x509_cert.x509)



class channel():
    def __init__(self, logging, serverUrl, clientPubKey, clientPrivateKey, caRootCert):
        self.logging = logging
        self.serverUlr = serverUrl
        self.rootCert = caRootCert
        self.cPubKey = clientPubKey
        self.cPriKey = clientPrivateKey
    
    def get_channel(self):
        print("going to connect")
        ccert = open("/home/pi/device-rsa-cert.pem", "rb").read()
        #ckey = open(self.cPriKey, "rb").read()
        rootca = open("/home/pi/ca-cert.pem", "rb").read()
        credentials = grpc.ssl_channel_credentials(root_certificates=rootca, private_key=pkey, certificate_chain=ccert)
        credentials._ssl_context = ssl_context
        #sslcredentials = grpc.ChannelCredentials.from_ssl_context(pem_bytes)
        #sslcredentials.ssl_context = ssl_context
        #sslcreds = grpc.SslCredentials(ssl_context)
        #sslcreds = grpc.ssl_channel_credentials(rootca, "engine:zymkey_ssl:pkcs11:token=device;object=iotkey;type=private", ccert)
        print("cred done")
        channel = grpc.secure_channel(target=self.serverUlr, credentials=credentials)
        #channel = grpc.insecure_channel(target=self.serverUlr, options={"grpc.ssl_context": ssl_context})
        #channel._channel.override_ssl_target('device.dss.com', ssl_context)
        return channel
        #print("secure channel done")
        #stub = deviceRegistration_pb2_grpc.DeviceRegistrationStub(grpcchannel)
        #print("got stub")
        
        #response = stub.RegisterDevice(deviceRegistration_pb2.DeviceRegistrationRequest(device_mac_add="test1", device_unique_id="test1", fw_version="test1", os_version="test1"))
        #print(response)
