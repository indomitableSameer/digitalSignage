package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetPlayScheduleRequest(w http.ResponseWriter, r *http.Request) {

	var playSchedule requests.PlaySchedule
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &playSchedule)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println("recived getPlaySchedule request")
	var schedule = response.PlaySchedule{ScheduleId: uuid.New(), StartDate: "21-01-2023", EndDate: "22-01-2023", StartTime: "14:00", EndTime: "15:00"}

	json, _ := json.Marshal(schedule)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
	return
}
