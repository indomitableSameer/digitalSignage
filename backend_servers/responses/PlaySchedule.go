package response

import (
	"github.com/google/uuid"
)

type PlaySchedule struct {
	ScheduleId uuid.UUID
	StartDate  string
	EndDate    string
	StartTime  string
	EndTime    string
}
