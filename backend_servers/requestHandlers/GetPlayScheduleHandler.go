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

func HandleGetPlayScheduleRequest(w http.ResponseWriter, r *http.Request) {

	var recvPlaySched requests.PlaySchedule
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &recvPlaySched)
	if err != nil {
		fmt.Println("error:", err)
	}

	var scheAllocDir dbentities.ScheduleAllocationDirectory
	dbprovider.Conn.RDb.Where("registration_id = ?", recvPlaySched.RegistrationId).First(&scheAllocDir)

	if scheAllocDir.Id != uuid.Nil {
		fmt.Println("recived getPlaySchedule request")
		var schedule = response.PlaySchedule{
			ScheduleId: scheAllocDir.Id,
			StartDate:  scheAllocDir.StartDate,
			EndDate:    scheAllocDir.EndDate,
			StartTime:  scheAllocDir.StartTime,
			EndTime:    scheAllocDir.EndTime,
		}

		json, _ := json.Marshal(schedule)
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(json)
	} else {
		http.Error(w, "schedule not found", http.StatusNotFound)
	}
}
