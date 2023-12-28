package main

import (
	"fmt"
	"net/http"
	"os"

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
	multiplexer.HandleFunc("/web/login", requesthandlers.HandleLoginRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/removeLocation", requesthandlers.HandleRemoveLocationRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/removeContent", requesthandlers.HandleRemoveContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/addLocation", requesthandlers.HandleAddLocationRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/getDeviceInfoList", requesthandlers.HandleGetDeviceInfoListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/addContent", requesthandlers.HandleAddContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/getContentList", requesthandlers.HandleGetContentListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/getCountryList", requesthandlers.HandleGetCountryListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/getCityList", requesthandlers.HandleGetCityListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/getBuildingList", requesthandlers.HandleGetBuildingListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/getAreaList", requesthandlers.HandleGetAreaListRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/getEventStream", requesthandlers.HandleEventStreamRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/web/updateAllocContent", requesthandlers.HandleUpdateAllocContentRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/web/updateAllocSchedule", requesthandlers.HandleUpdateAllocScheduleRequest).Methods(http.MethodPost)

	// Device APIs
	multiplexer.HandleFunc("/device/statusUpdate", requesthandlers.HandleStatusUpdateRequest).Methods(http.MethodPost)
	multiplexer.HandleFunc("/device/getContent", requesthandlers.HandleGetContentRequest).Methods(http.MethodGet)
	multiplexer.HandleFunc("/device/getPlaySchedule", requesthandlers.HandleGetPlayScheduleRequest).Methods(http.MethodGet)

	// CORS settings
	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"GET", "PUT", "POST", "OPTIONS"})
	ttl := handlers.MaxAge(3600)
	//corsOption := handlers.AllowedOriginValidator(OriginValidator)
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Authorization", "Content-Type", "Credentials"})
	// origins := handlers.AllowedOrigins([]string{"*"})
	origins := handlers.AllowedOrigins([]string{"https://web.dss.com", "https://web.dss.com:443"})
	fmt.Println("Started server at port 8001")
	loggedRouter := handlers.CombinedLoggingHandler(os.Stdout, multiplexer)
	servererror := http.ListenAndServe(":8001", handlers.CORS(credentials, methods, origins, ttl, headers)(loggedRouter))

	if servererror != nil {
		fmt.Println(servererror)
	}
}
