rm reg-server-key.pem
rm reg-server-public-key.pem
rm reg-server.csr
rm reg-server-ext.cnf 
rm reg-server-cert.pem

# 2. Generate web server's private key and certificate signing request (CSR)
openssl ecparam -name prime256v1 -genkey -noout -out reg-server-key.pem
openssl ec -in reg-server-key.pem -pubout -out reg-server-public-key.pem
openssl req -key reg-server-key.pem -new -out reg-server.csr -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=register.dss.com/emailAddress=tls@gmail.com" 

echo "subjectAltName=DNS:register.dss.com,DNS:localhost,IP:0.0.0.0" > reg-server-ext.cnf
echo "keyUsage=digitalSignature,keyEncipherment,nonRepudiation,dataEncipherment" >> reg-server-ext.cnf
echo "extendedKeyUsage=serverAuth,clientAuth" >> reg-server-ext.cnf
openssl x509 -req -in reg-server.csr -CA ../ca/ca-cert.pem -CAkey ../ca/ca-key.pem -CAcreateserial -out reg-server-cert.pem -extfile reg-server-ext.cnf -days 365

echo "Server's signed certificate"
openssl x509 -in reg-server-cert.pem -noout -text
