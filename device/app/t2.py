from M2Crypto import m2urllib2 as urllib2
from M2Crypto import m2, SSL, Engine


# load dynamic engine
pk = Engine.load_dynamic_engine("pkcs11", "/usr/lib/aarch64-linux-gnu/engines-1.1/zymkey_ssl.so")
#pk = Engine.Engine("pkcs11")
pk.ctrl_cmd_string("MODULE_PATH", "/usr/lib/libzk_pkcs11.so")

m2.engine_init(m2.engine_by_id("pkcs11"))
pk.ctrl_cmd_string("PIN", '1234')
cert = pk.load_certificate('/home/pi/device-rsa-cert.pem')
key = pk.load_private_key('pkcs11:model=SoftHSM%20v2;manufacturer=SoftHSM%20project;serial=6b307d0622b88e72;token=device;id=%74%F2%CD%F0%0F%CA%09%4A%0C%61%31%6C%0F%DD%CD%7E%AE%42%08%3C;object=zymkeyrsa;type=private', pin='1234')


ssl_context = SSL.Context('tls')
ssl_context.set_cipher_list('EECDH+AESGCM:EECDH+aECDSA:EECDH+aRSA:EDH+AESGCM:EDH+aECDSA:EDH+aRSA:!SHA1:!SHA256:!SHA384:!MEDIUM:!LOW:!EXP:!aNULL:!eNULL:!PSK:!SRP:@STRENGTH')
ssl_context.set_default_verify_paths()
ssl_context.set_allow_unknown_ca(True)

SSL.Connection.postConnectionCheck = None

m2.ssl_ctx_use_x509(ssl_context.ctx, cert.x509)
m2.ssl_ctx_use_pkey_privkey(ssl_context.ctx, key.pkey)

opener = urllib2.build_opener(ssl_context)
urllib2.install_opener(opener)

url = 'device.dss.com:4001/albums'

content = urllib2.urlopen(url=url).read()
# content = opener.open(url)
print(content)