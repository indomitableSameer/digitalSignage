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
		var device dbentities.DeviceList
		device.DeviceId = uuid.New()
		device.Mac = addDevReq.Mac
		result := dbprovider.Conn.RDb.Create(&device)
		if result.Error != nil {
			http.Error(w, "entry already exists", http.StatusInternalServerError)
		}
	} else {
		http.Error(w, "missing details", 412)
	}
	return
}
