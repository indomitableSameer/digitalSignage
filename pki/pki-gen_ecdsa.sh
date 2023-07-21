rm *.pem
rm *.srl
rm *.cnf
rm *.csr
rm *.cert

sleep 5

# 1. Generate CA's private key and self-signed certificate
openssl ecparam -name prime256v1 -genkey -noout -out ca-key.pem
openssl ec -in ca-key.pem -pubout -out ca-public-key.pem
openssl req -new -x509 -key ca-key.pem -out ca-cert.pem -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=TEST_CA/emailAddress=test@gmail.com"

echo "CA's self-signed certificate"
openssl x509 -in ca-cert.pem -noout -text

# 2. Generate web server's private key and certificate signing request (CSR)
#openssl ecparam -name prime256v1 -genkey -noout -out server-key.pem
#openssl ec -in server-key.pem -pubout -out server-public-key.pem
#openssl req -key server-key.pem -new -out server.csr -subj "/C=DE/ST=Hessen/L=FRA/O=FRA-UAS/OU=FB2/CN=TEST_CA/emailAddress=tls@gmail.com"

#echo "subjectAltName=DNS:TEST_CA,DNS:localhost,IP:0.0.0.0" > server-ext.cnf
#openssl x509 -req -in server.csr -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile server-ext.cnf

#echo "Server's signed certificate"
#openssl x509 -in server-cert.pem -noout -text


# Remember that when we develop on localhost, It’s important to add the IP:0.0.0.0 as an Subject Alternative Name (SAN) extension to the certificate.
#echo "subjectAltName=DNS:*.client.com,IP:0.0.0.0" > client-ext.cnf

# 5. Use CA's private key to sign client's CSR and get back the signed certificate
#openssl x509 -req -in client-req.pem -days 60 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -extfile client-ext.cnf

#echo "Client's signed certificate"
#openssl x509 -in client-cert.pem -noout -text
