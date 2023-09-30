package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type ScheduleAllocationDirectory struct {
	Id              uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	DeviceId        uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	StartDate       string
	EndDate         string
	StartTime       string
	EndTime         string
	CreatedAt       time.Time
	DeviceDirectory DeviceDirectory `gorm:"foreignKey:DeviceId;references:DeviceID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
