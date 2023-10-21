package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleDeviceRegistrationRequest(w http.ResponseWriter, r *http.Request) {
	var regReq requests.DeviceRegistrationRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &regReq)
	if err != nil {
		fmt.Println("error:", err)
		http.Error(w, "Unable to parse request body", http.StatusBadRequest)
	}

	var aB dbentities.Building
	var aC dbentities.City
	var aCo dbentities.Country
	dbprovider.Conn.RDb.Where("id= ?", 1).First(&aB)
	dbprovider.Conn.RDb.Where("id= ?", aB.CityId).First(&aC)
	dbprovider.Conn.RDb.Where("id= ?", aC.CountryId).First(&aCo)

	fmt.Println("reg request received from device -> ", regReq.Mac)
	var deviceDirEntry dbentities.DeviceDirectory
	dbprovider.Conn.RDb.Where("Mac = ?", regReq.Mac).First(&deviceDirEntry)
	if regReq.Mac == deviceDirEntry.MAC {

		var aArea dbentities.Area
		var registerdDevices dbentities.DeviceRegistrationDirectory

		dbprovider.Conn.RDb.Where("id = ?", deviceDirEntry.AreaId).First(&aArea)
		dbprovider.Conn.RDb.Where("Device_Id = ?", deviceDirEntry.DeviceID).First(&registerdDevices)

		if registerdDevices.DeviceId != uuid.Nil {
			response := response.DeviceRegistrationResponse{ServiceUrl: registerdDevices.ServiceUrl, ServicePort: registerdDevices.ServicePort, RegistrationStatus: 2, UniqueSystemId: registerdDevices.RegistrationId, Timezone: "Europe/Berlin"}
			json, _ := json.Marshal(response)
			w.Header().Set("content-type", "application/json")
			w.Write(json)
			return
		}

		// add this to db and send response
		var register dbentities.DeviceRegistrationDirectory
		register.DeviceId = deviceDirEntry.DeviceID
		register.RegistrationId = uuid.New()
		register.ServiceUrl = "device.dss.com"
		register.ServicePort = "4001"
		dbprovider.Conn.RDb.Create(&register)
		response := response.DeviceRegistrationResponse{ServiceUrl: register.ServiceUrl, ServicePort: register.ServicePort, RegistrationStatus: 1, UniqueSystemId: register.RegistrationId, Timezone: "Europe/Berlin"}
		json, _ := json.Marshal(response)
		w.Header().Set("content-type", "application/json")
		w.Write(json)
	} else {
		http.Error(w, "Unable to find mac in backend", http.StatusBadRequest)
	}
}
