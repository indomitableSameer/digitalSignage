import time
import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509

ciphers = "EECDH+AESGCM:EECDH+aECDSA:EECDH+aRSA:EDH+AESGCM:EDH+aECDSA:EDH+aRSA:!SHA1:SHA256:SHA384:!MEDIUM:!LOW:!EXP:!aNULL:!eNULL:!PSK:!SRP:@STRENGTH"

ssl_enigne = M2Crypto.Engine.load_dynamic_engine('pkcs11', "/usr/lib/aarch64-linux-gnu/engines-1.1/zymkey_ssl.so")
print("engine initalizing..")
ssl_enigne.init()
print("engine initalized:" + ssl_enigne.get_name())
print("engine id:" + ssl_enigne.get_id())

#pkey = ssl_enigne.load_private_key("pkcs11:token=device;object=devicekey;type=private", '1234')
#print(pkey)

ssl_context = M2Crypto.SSL.Context('tls')
ssl_context.set_cipher_list(ciphers)
ssl_context.set_verify(mode=M2Crypto.SSL.verify_peer | M2Crypto.SSL.verify_fail_if_no_peer_cert, depth=1)
ssl_context.load_verify_locations("./../../pki/ca/ca-cert.pem")
#ssl_context.load_cert("./pki/device-cert.pem")
pkey = ssl_enigne.load_private_key("pkcs11:token=device;object=devicekey;type=private", "1234")
#M2Crypto.m2.ssl_ctx_use_pkey_privkey(ssl_context.ctx, pkey.pkey)
#ssl_context.load_cert("./pki/device-cert.pem")
ccert = open("./pki/device-cert.pem", "rb").read()
x509_cert = M2Crypto.X509.load_cert_string(ccert)
M2Crypto.m2.ssl_ctx_use_x509(ssl_context.ctx, x509_cert.x509)

#M2Crypto.m2.ssl_ctx_use_pkey_privkey(ssl_context.ctx, pkey.pkey)
connection = M2Crypto.httpslib.HTTPSConnection('device.dss.com', 4001, ssl_context=ssl_context)
connection.set_debuglevel(3)

connection.connect()

res = connection.request("GET", "/albums")
print(res)
time.sleep(10)
connection.close()
#connection.ses
#response = connection.getresponse()

#session = connection.get_session()
#print(session)
#print(connection.sock.get_state())
#h.request())

#ssl_engine = M2Crypto.Engine.Engine('zymkey_ssl')
#ssl_engine.ctrl_cmd_string("MODULE_PATH", '/usr/lib/libzk_pkcs11.so')
#M2Crypto.m2.engine_init(M2Crypto.m2.engine_by_id('zymkey_ssl'))
