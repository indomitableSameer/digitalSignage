package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	requesthandlers "github.com/indomitableSameer/digitalSignage/backend_servers/requestHandlers"
)

func main() {

	dbprovider.Conn.RDb.AutoMigrate(&dbentities.DeviceRegistrationDirectory{})

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/registerDevice", requesthandlers.HandleDeviceRegistrationRequest).Methods(http.MethodPost)

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"POST", "OPTIONS"})
	ttl := handlers.MaxAge(3600)
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Authorization", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	fmt.Println("started registration server at 8000..")
	servererror := http.ListenAndServe(":8000", handlers.CORS(credentials, methods, origins, ttl, headers)(multiplexer))
	if servererror != nil {
		fmt.Println(servererror)
	}
}
