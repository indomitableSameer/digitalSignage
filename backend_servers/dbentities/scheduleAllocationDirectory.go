package dbentities

import (
	"github.com/google/uuid"
)

type ScheduleAllocationDirectory struct {
	ScheduleId     uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	RegistrationId uuid.UUID `gorm:"unique; not null"`
	StartDate      string
	EndDate        string
	StartTime      string
	EndTime        string
}
