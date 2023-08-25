package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	requesthandlers "github.com/indomitableSameer/digitalSignage/backend_servers/requestHandlers"

	"github.com/gorilla/mux"
)

func main() {

	fmt.Println("creating db..")
	dbprovider.DBObj.AutoMigrate(&dbentities.DeviceList{})
	dbprovider.DBObj.AutoMigrate(&dbentities.DeviceStatus{})
	dbprovider.DBObj.AutoMigrate(&dbentities.ContentInfo{})

	content := dbentities.ContentInfo{ContentId: uuid.New(), FileName: "test.mp4"}
	dbprovider.DBObj.Create(&content)

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/status", requesthandlers.HandleStatusRequest).Methods(http.MethodPut)
	multiplexer.HandleFunc("/content", requesthandlers.HandleContentRequest).Methods(http.MethodPost)
	servererror := http.ListenAndServe(":8000", multiplexer)
	if servererror != nil {
		fmt.Println(servererror)
	}
}
