rm server-key.pem
rm server-public-key.pem
rm server.csr
rm server-ext.cnf 
rm server-cert.pem

# 2. Generate web server's private key and certificate signing request (CSR)
openssl ecparam -name prime256v1 -genkey -noout -out server-key.pem
openssl ec -in server-key.pem -pubout -out server-public-key.pem
openssl req -key server-key.pem -new -out server.csr -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=web.dss.com/emailAddress=tls@gmail.com"

echo "subjectAltName=DNS:web.dss.com,DNS:localhost,IP:0.0.0.0" > server-ext.cnf
echo "keyUsage=digitalSignature,keyEncipherment,nonRepudiation,dataEncipherment" >> server-ext.cnf
echo "extendedKeyUsage=serverAuth,clientAuth" >> server-ext.cnf
openssl x509 -req -in server.csr -CA ../ca/ca-cert.pem -CAkey ../ca/ca-key.pem -CAcreateserial -out server-cert.pem -extfile server-ext.cnf -days 365

echo "Server's signed certificate"
openssl x509 -in server-cert.pem -noout -text
