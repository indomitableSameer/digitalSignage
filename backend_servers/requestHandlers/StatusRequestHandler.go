package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
	"gorm.io/gorm/clause"
)

func HandleStatusUpdateRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("received status update req")
	var statusReq requests.StatusUpdateRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &statusReq)
	if err != nil {
		fmt.Println("error:", err)
		http.Error(w, "Unable to parse request", http.StatusBadRequest)
		return
	}

	var regDev dbentities.DeviceRegistrationDirectory
	dbprovider.Conn.RDb.Where("Registration_Id = ?", statusReq.RegistrationId).First(&regDev)
	if regDev.RegistrationId != uuid.Nil {

		var aAllocSchedule dbentities.ScheduleAllocationDirectory
		var aAllocContent dbentities.ContentAllocationDirectory
		dbprovider.Conn.RDb.Where("device_id = ?", regDev.DeviceId).First(&aAllocSchedule)
		dbprovider.Conn.RDb.Where("device_id = ?", regDev.DeviceId).First(&aAllocContent)
		if aAllocSchedule.Id.String() != statusReq.ScheduleAllocId ||
			aAllocContent.Id.String() != statusReq.ContentAllocId {
			// now tell client then he is out of sync
			w.WriteHeader(http.StatusConflict)
		}

		// add this to db and send response
		var status dbentities.DeviceStatusRegister
		var existingStatusEntry dbentities.DeviceStatusRegister
		dbprovider.Conn.RDb.Where("Registration_Id = ?", regDev.RegistrationId).First(&existingStatusEntry)
		if existingStatusEntry.StatusId == uuid.Nil {
			status.StatusId = uuid.New()
		} else {
			status.StatusId = existingStatusEntry.StatusId
		}

		status.RegistrationId = regDev.RegistrationId
		status.ScheduleAllocId, _ = uuid.Parse(statusReq.ScheduleAllocId)
		status.ContentAllocId, _ = uuid.Parse(statusReq.ContentAllocId)
		status.AppVersion = statusReq.App_Version
		status.OsVersion = statusReq.Os_Version
		status.IpAddr = statusReq.IpAddr
		status.UpdatedAt = time.Now()
		dbprovider.Conn.RDb.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "status_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"schedule_alloc_id", "content_alloc_id", "ip_addr", "os_version", "app_version", "updated_at"}),
		}).Create(&status)

	} else {
		http.Error(w, "can not update as device not registered", http.StatusBadRequest)
		return
	}
}
