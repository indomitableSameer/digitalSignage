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

func HandleUpdateAllocContentRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived updateAllocContent request")
	const contentInfoBucket = "dss-content-thumbnail-files"
	const contentFileBucket = "dss-content-video-files"

	var updateAllocContent requests.UpdateAllocContentRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &updateAllocContent)
	if err != nil || len(updateAllocContent.ContentInfoId) == 0 || len(updateAllocContent.Mac) == 0 {
		fmt.Println("error:", err)
		http.Error(w, "failed to parse request", http.StatusBadRequest)
		return
	}

	var aContentInfo dbentities.ContentInfo
	dbprovider.Conn.RDb.Where("content_id = ?", updateAllocContent.ContentInfoId).First(&aContentInfo)
	if aContentInfo.ContentId == uuid.Nil {
		http.Error(w, "failed to content with the given Id.", http.StatusBadRequest)
		return
	}

	var adevInfo dbentities.DeviceDirectory
	dbprovider.Conn.RDb.Where("mac = ?", updateAllocContent.Mac).First(&adevInfo)
	if adevInfo.DeviceID == uuid.Nil {
		http.Error(w, "failed to find device with given mac id.", http.StatusBadRequest)
		return
	}

	var aContentAllocDir dbentities.ContentAllocationDirectory
	dbprovider.Conn.RDb.Where("device_id = ?", adevInfo.DeviceID).First(&aContentAllocDir)
	if aContentAllocDir.Id != uuid.Nil {
		fmt.Println("found allocated content entry.. removing..")
		if err := dbprovider.Conn.RDb.Delete(&aContentAllocDir).Error; err != nil {
			fmt.Print(err)
			http.Error(w, "Failed to revove entry.", http.StatusInternalServerError)
			return
		}
	}

	var aDevContent dbentities.ContentAllocationDirectory
	aDevContent.Id = uuid.New()
	aDevContent.ContentInfoId = aContentInfo.ContentId
	aDevContent.DeviceId = adevInfo.DeviceID
	result := dbprovider.Conn.RDb.Create(&aDevContent)
	if result.Error != nil {
		http.Error(w, "somthing went wrong while content allocation", http.StatusInternalServerError)
		return
	}
	return
}
