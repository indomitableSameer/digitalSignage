rm client-key.pem
rm client-public-key.pem
rm client.csr
rm client-ext.cnf 
rm client-cert.pem

# 2. Generate web client's private key and certificate signing request (CSR)
openssl ecparam -name prime256v1 -genkey -noout -out client-key.pem
openssl ec -in client-key.pem -pubout -out client-public-key.pem
openssl req -key client-key.pem -new -out client.csr -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=*.dss.com/emailAddress=tls@gmail.com"

echo "subjectAltName=DNS:*.dss.com,IP:0.0.0.0" > client-ext.cnf
echo "keyUsage=digitalSignature,keyEncipherment,nonRepudiation,dataEncipherment" >> client-ext.cnf
echo "extendedKeyUsage=clientAuth" >> client-ext.cnf
openssl x509 -req -in client.csr -CA ../ca/ca-cert.pem -CAkey ../ca/ca-key.pem -CAcreateserial -out client-cert.pem -extfile client-ext.cnf -days 365

echo "client's signed certificate"
openssl x509 -in client-cert.pem -noout -text
