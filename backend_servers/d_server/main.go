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

	fmt.Println("migrating db..")
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

	// Web APIs
	multiplexer.HandleFunc("/login", requesthandlers.HandleLoginRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/removeLocation", requesthandlers.HandleRemoveLocationRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/removeContent", requesthandlers.HandleRemoveContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/addLocation", requesthandlers.HandleAddLocationRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/getDeviceInfoList", requesthandlers.HandleGetDeviceInfoListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/addContent", requesthandlers.HandleAddContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/getContentList", requesthandlers.HandleGetContentListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getCountryList", requesthandlers.HandleGetCountryListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getCityList", requesthandlers.HandleGetCityListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getBuildingList", requesthandlers.HandleGetBuildingListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getAreaList", requesthandlers.HandleGetAreaListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getEventStream", requesthandlers.HandleEventStreamRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/updateAllocContent", requesthandlers.HandleUpdateAllocContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/updateAllocSchedule", requesthandlers.HandleUpdateAllocScheduleRequest).Methods(http.MethodPost)

	// Device APIs
	multiplexer.HandleFunc("/statusUpdate", requesthandlers.HandleStatusUpdateRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/getContent", requesthandlers.HandleGetContentRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/getPlaySchedule", requesthandlers.HandleGetPlayScheduleRequest).Methods(http.MethodGet)

	// CORS settings
	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"GET", "PUT", "POST", "OPTIONS"})
	ttl := handlers.MaxAge(3600)
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Authorization", "Content-Type", "Credentials"})
	origins := handlers.AllowedOrigins([]string{"https://web.dss.com"})
	fmt.Println("Started server at port 8001")
	servererror := http.ListenAndServe(":8001", handlers.CORS(credentials, methods, origins, ttl, headers)(multiplexer))

	if servererror != nil {
		fmt.Println(servererror)
	}
}
