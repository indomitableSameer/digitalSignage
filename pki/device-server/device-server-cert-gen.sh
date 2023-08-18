rm device-server-key.pem
rm device-server-public-key.pem
rm device-server.csr
rm device-server-ext.cnf 
rm device-server-cert.pem

# 2. Generate web server's private key and certificate signing request (CSR)
openssl ecparam -name prime256v1 -genkey -noout -out device-server-key.pem
openssl ec -in device-server-key.pem -pubout -out device-server-public-key.pem
openssl req -key device-server-key.pem -new -out device-server.csr -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=device.dss.com/emailAddress=tls@gmail.com" 

echo "subjectAltName=DNS:device.dss.com,DNS:localhost,IP:0.0.0.0" > device-server-ext.cnf
echo "keyUsage=digitalSignature,keyEncipherment,nonRepudiation,dataEncipherment" >> device-server-ext.cnf
echo "extendedKeyUsage=serverAuth,clientAuth" >> device-server-ext.cnf
openssl x509 -req -in device-server.csr -CA ../ca/ca-cert.pem -CAkey ../ca/ca-key.pem -CAcreateserial -out device-server-cert.pem -extfile device-server-ext.cnf -days 365

echo "Server's signed certificate"
openssl x509 -in device-server-cert.pem -noout -text
