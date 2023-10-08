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

func HandleRemoveLocationRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived removeContent request")
	const contentInfoBucket = "dss-content-thumbnail-files"
	const contentFileBucket = "dss-content-video-files"

	var removeLocReq requests.RemoveLocation
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &removeLocReq)
	if err != nil || len(removeLocReq.DeviceId) == 0 {
		fmt.Println("error:", err)
		http.Error(w, "failed to parse request", http.StatusBadRequest)
		return
	}

	var aDevInfo dbentities.DeviceDirectory
	dbprovider.Conn.RDb.Where("mac = ?", removeLocReq.DeviceId).First(&aDevInfo)
	if aDevInfo.DeviceID == uuid.Nil {
		http.Error(w, "failed to device with the given Id.", http.StatusBadRequest)
		return
	}

	dbprovider.Conn.RDb.Delete(&aDevInfo)

	fmt.Println("location removed successfully")
	return
}
