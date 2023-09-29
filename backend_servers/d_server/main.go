package main

import (
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	requesthandlers "github.com/indomitableSameer/digitalSignage/backend_servers/requestHandlers"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	fmt.Println("creating db..")
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.ContentInfo{})

	dbprovider.Conn.RDb.AutoMigrate(&dbentities.Country{})
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.City{})
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.Building{})
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.Area{})

	dbprovider.Conn.RDb.AutoMigrate(&dbentities.DeviceDirectory{})
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.DeviceRegistrationDirectory{})

	dbprovider.Conn.RDb.AutoMigrate(&dbentities.ContentAllocationDirectory{})
	dbprovider.Conn.RDb.AutoMigrate(&dbentities.ScheduleAllocationDirectory{})

	dbprovider.Conn.RDb.AutoMigrate(&dbentities.DeviceStatusRegister{})

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/status", requesthandlers.HandleStatusRequest).Methods(http.MethodPut)
	multiplexer.HandleFunc("/content", requesthandlers.HandleContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/addDevice", requesthandlers.HandleAddDeviceRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/deviceList", requesthandlers.HandleGetDeviceListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/addContent", requesthandlers.HandleAddContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/getContentList", requesthandlers.HandleGetContentListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getPlaySchedule", requesthandlers.HandleGetPlayScheduleRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/addPlaySchedule", requesthandlers.HandleAddPlayScheduleRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/getCountryList", requesthandlers.HandleGetCountryListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getCityList", requesthandlers.HandleGetCityListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getBuildingList", requesthandlers.HandleGetBuildingListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getAreaList", requesthandlers.HandleGetAreaListRequest).Methods(http.MethodGet)

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"GET", "PUT", "POST", "OPTIONS"})
	ttl := handlers.MaxAge(3600)
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Authorization", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	/*, "localhost", "localhost:5173", "127.0.0.1", "127.0.0.1:5173", "http://127.0.0.1", "http://127.0.0.1:5173/"*/
	fmt.Println("taking care of cors..")
	//servererror := http.ListenAndServe(":8000", handlers.CORS(methods, origins, ttl, header)(multiplexer))
	servererror := http.ListenAndServe(":8000", handlers.CORS(credentials, methods, origins, ttl, headers)(multiplexer))
	if servererror != nil {
		fmt.Println(servererror)
	}
}
