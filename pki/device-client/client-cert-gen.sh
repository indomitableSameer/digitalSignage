rm device-ext.cnf 
rm device-cert.pem

echo "subjectAltName=DNS:*.device.com,DNS:localhost,IP:0.0.0.0" > device-ext.cnf
echo "keyUsage=digitalSignature,keyEncipherment,nonRepudiation,dataEncipherment" >> device-ext.cnf
echo "extendedKeyUsage=clientAuth" >> device-ext.cnf
openssl x509 -req -in device.csr -CA ../ca/ca-cert.pem -CAkey ../ca/ca-key.pem -CAcreateserial -out device-cert.pem -extfile device-ext.cnf -days 365

echo "device's signed certificate"
openssl x509 -in device-cert.pem -noout -text
