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

func HandleAddPlayScheduleRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("AddPlaySchedule received")
	var addPlaySchedule requests.AddPlaySchedule
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &addPlaySchedule)
	if err != nil {
		fmt.Println("error:", err)
	}

	var schedule dbentities.ScheduleAllocationDirectory
	if len(addPlaySchedule.StartDate) > 0 {
		schedule.StartDate = addPlaySchedule.StartDate
	}

	if len(addPlaySchedule.EndDate) > 0 {
		schedule.EndDate = addPlaySchedule.EndDate
	}

	if len(addPlaySchedule.StartTime) > 0 {
		schedule.StartTime = addPlaySchedule.StartTime
	}

	if len(addPlaySchedule.EndTime) > 0 {
		schedule.EndTime = addPlaySchedule.EndTime
	}

	var devDir dbentities.DeviceDirectory
	var devRegDir dbentities.DeviceRegistrationDirectory
	dbprovider.Conn.RDb.Where("mac = ?", addPlaySchedule.Mac).First(&devDir)
	dbprovider.Conn.RDb.Where("device_id = ?", devDir.DeviceID).First(&devRegDir)

	if devRegDir.RegistrationId != uuid.Nil {
		schedule.ScheduleId = uuid.New()
		schedule.RegistrationId = devRegDir.RegistrationId
		result := dbprovider.Conn.RDb.Create(&schedule)
		if result.Error != nil {
			fmt.Print(result)
			http.Error(w, "somthing went worng", http.StatusInternalServerError)
		}
	} else {
		http.Error(w, "missing device registration details in db", http.StatusBadRequest)
	}
}
