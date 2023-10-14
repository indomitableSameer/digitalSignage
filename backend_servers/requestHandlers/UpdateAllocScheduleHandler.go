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

func HandleUpdateAllocScheduleRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("UpdateAllocSchedule received")
	var updateAllocSchedule requests.UpdateAllocScheduleRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &updateAllocSchedule)
	if err != nil {
		fmt.Println("error:", err)
		http.Error(w, "failed to parse request", http.StatusBadRequest)
		return
	}

	var schedule dbentities.ScheduleAllocationDirectory
	if len(updateAllocSchedule.StartDate) > 0 {
		schedule.StartDate = updateAllocSchedule.StartDate
	}

	if len(updateAllocSchedule.EndDate) > 0 {
		schedule.EndDate = updateAllocSchedule.EndDate
	}

	if len(updateAllocSchedule.StartTime) > 0 {
		schedule.StartTime = updateAllocSchedule.StartTime
	}

	if len(updateAllocSchedule.EndTime) > 0 {
		schedule.EndTime = updateAllocSchedule.EndTime
	}

	if len(schedule.StartDate) == 0 || len(schedule.EndDate) == 0 || len(schedule.StartTime) == 0 || len(schedule.EndTime) == 0 {
		fmt.Println("missing values")
		http.Error(w, "missing values", http.StatusBadRequest)
		return
	}

	var devDir dbentities.DeviceDirectory
	dbprovider.Conn.RDb.Where("mac = ?", updateAllocSchedule.Mac).First(&devDir)
	if devDir.DeviceID == uuid.Nil {
		fmt.Print("missing device with given mac..")
		http.Error(w, "missing device details in db", http.StatusBadRequest)
		return
	}

	var aSchedAllocDir dbentities.ScheduleAllocationDirectory
	dbprovider.Conn.RDb.Where("device_id = ?", devDir.DeviceID).First(&aSchedAllocDir)
	if aSchedAllocDir.Id != uuid.Nil {
		fmt.Println("found allocated schedule entry.. removing..")
		if err := dbprovider.Conn.RDb.Delete(&aSchedAllocDir).Error; err != nil {
			fmt.Print(err)
			http.Error(w, "Failed to revove entry.", http.StatusInternalServerError)
			return
		}
	}

	schedule.Id = uuid.New()
	schedule.DeviceId = devDir.DeviceID
	result := dbprovider.Conn.RDb.Create(&schedule)
	if result.Error != nil {
		fmt.Print(result)
		http.Error(w, "somthing went worng", http.StatusInternalServerError)
	}
}
