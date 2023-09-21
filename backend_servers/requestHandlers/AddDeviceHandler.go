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
)

func HandleAddDeviceRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("adding device to db")
	var addDevReq requests.AddDevice
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &addDevReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	if len(addDevReq.Mac) > 0 && len(addDevReq.Location) > 0 {
		var countryInfo dbentities.Country
		dbprovider.Conn.RDb.Where("name = ?", addDevReq.Location).First(&countryInfo)
		if len(countryInfo.Name) > 0 && countryInfo.Name == addDevReq.Location {
			var device dbentities.DeviceDirectory
			device.DeviceID = uuid.New()
			device.MAC = addDevReq.Mac
			device.CountryId = countryInfo.Id
			result := dbprovider.Conn.RDb.Create(&device)
			if result.Error != nil {
				http.Error(w, "entry already exists", http.StatusInternalServerError)
			}
		} else {
			http.Error(w, "Country not supported", http.StatusNotFound)
		}
	} else {
		http.Error(w, "missing details", http.StatusBadRequest)
	}
	return
}
