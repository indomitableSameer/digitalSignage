package main

import (
    "crypto/tls"
    "crypto/x509"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    // Create a TLS configuration with the CA certificate.
    caCert, err := ioutil.ReadFile("../pki/ca/ca-cert.pem")
    if err != nil {
        fmt.Println(err)
        return
    }
    caCertPool := x509.NewCertPool()
    caCertPool.AppendCertsFromPEM(caCert)
    cert, _ := tls.LoadX509KeyPair("../pki/client/client-cert.pem", "../pki/client/client-cert.pem")
    cfg := &tls.Config{
        MinVersion:               tls.VersionTLS12,
        CurvePreferences:         []tls.CurveID{tls.CurveP521, tls.CurveP384, tls.CurveP256},
        PreferServerCipherSuites: true,
        CipherSuites: []uint16{
            tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
            tls.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
            tls.TLS_RSA_WITH_AES_256_GCM_SHA384,
            tls.TLS_RSA_WITH_AES_256_CBC_SHA,
        },
        RootCAs: caCertPool,
        Certificates: []tls.Certificate{cert},
        InsecureSkipVerify: true,
    }

    // Create a new HTTP client with the TLS configuration.
    client := &http.Client{
            Transport: &http.Transport{
            TLSClientConfig: cfg,
        },
    }

    // Make an HTTPS request to the server.
    resp, err := client.Get("https://localhost:443")
    if err != nil {
        fmt.Println(err)
        return
    }

    // Close the response body.
    defer resp.Body.Close()

    // Check the server certificate.
    if resp.TLS != nil {
        certs := resp.TLS.PeerCertificates
        for _, cert := range certs {
            fmt.Println(cert.Subject.CommonName)
        }
    }
}
