import M2Crypto.SSL
import M2Crypto.Engine
import M2Crypto.X509
import os

ciphers = "EECDH+AESGCM:EECDH+aECDSA:EECDH+aRSA:EDH+AESGCM:EDH+aECDSA:EDH+aRSA:!SHA1:SHA256:SHA384:!MEDIUM:!LOW:!EXP:!aNULL:!eNULL:!PSK:!SRP:@STRENGTH"


def getConnection(url, port):
    ssl_enigne = M2Crypto.Engine.Engine(os.getenv("ENGINE"))
    ssl_enigne.init()

    ssl_context = M2Crypto.SSL.Context('tls')
    ssl_context.set_verify(mode=M2Crypto.SSL.verify_peer | M2Crypto.SSL.verify_fail_if_no_peer_cert, depth=1)

    ssl_context.load_verify_locations(os.getenv("CA_FILE"))
    pkey = ssl_enigne.load_private_key(os.getenv("PKCS_URL"), os.getenv("ENGINE_PIN"))
    M2Crypto.m2.ssl_ctx_use_pkey_privkey(ssl_context.ctx, pkey.pkey)

    ccert = open(os.getenv("CERT_FILE"), "rb").read()
    x509_cert = M2Crypto.X509.load_cert_string(ccert)
    M2Crypto.m2.ssl_ctx_use_x509(ssl_context.ctx, x509_cert.x509)

    return M2Crypto.httpslib.HTTPSConnection(url, port, ssl_context=ssl_context)