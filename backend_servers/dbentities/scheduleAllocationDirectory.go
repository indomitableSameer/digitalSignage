package dbentities

import (
	"github.com/google/uuid"
)

type ScheduleAllocationDirectory struct {
	ScheduleId                  uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	RegistrationId              uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	StartDate                   string
	EndDate                     string
	StartTime                   string
	EndTime                     string
	DeviceRegistrationDirectory DeviceRegistrationDirectory `gorm:"foreignKey:RegistrationId;references:RegistrationId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
