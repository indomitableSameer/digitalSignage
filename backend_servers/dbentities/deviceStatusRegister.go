package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceStatusRegister struct {
	StatusId                    uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	RegistrationId              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();not null"`
	ScheduleId                  uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	ContentId                   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	IpAddr                      string
	OsVersion                   string
	AppVersion                  string
	CreatedAt                   time.Time
	UpdatedAt                   time.Time
	ContentAllocationDirectory  ContentAllocationDirectory  `gorm:"foreignKey:ContentId;references:ContentId;constraint:OnUpdate:SET NULL,OnDelete:SET NULL;"`
	ScheduleAllocationDirectory ScheduleAllocationDirectory `gorm:"foreignKey:ScheduleId;references:ScheduleId;constraint:OnUpdate:SET NULL,OnDelete:SET NULL;"`
	DeviceRegistrationDirectory DeviceRegistrationDirectory `gorm:"foreignKey:RegistrationId;references:RegistrationId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
