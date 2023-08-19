from dataclasses import dataclass
from http.client import HTTPConnection
import http.client
import json
import pprint
import time
from urllib.request import HTTPHandler
import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509
import M2Crypto.m2urllib2 as urllib2
import requests

class DeviceRegisterRequest:
    def __init__(self):
        self.Mac = "12:11:11:11:11"
        self.IpAddr = "123.123.232.32"

ciphers = "EECDH+AESGCM:EECDH+aECDSA:EECDH+aRSA:EDH+AESGCM:EDH+aECDSA:EDH+aRSA:!SHA1:SHA256:SHA384:!MEDIUM:!LOW:!EXP:!aNULL:!eNULL:!PSK:!SRP:@STRENGTH"


def getConnection():
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

    ccert = open("/home/pi/device-rsa-cert.pem", "rb").read()
    x509_cert = M2Crypto.X509.load_cert_string(ccert)
    M2Crypto.m2.ssl_ctx_use_x509(ssl_context.ctx, x509_cert.x509)

    return M2Crypto.httpslib.HTTPSConnection('device.dss.com', 4001, ssl_context=ssl_context)