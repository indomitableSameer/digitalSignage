package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceStatusRegister struct {
	StatusId                    uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	RegistrationId              uuid.UUID `gorm:"type:uuid;unique;default:uuid_generate_v4();not null"`
	ScheduleAllocId             uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	ContentAllocId              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	IpAddr                      string
	OsVersion                   string
	AppVersion                  string
	CreatedAt                   time.Time
	UpdatedAt                   time.Time
	ContentAllocationDirectory  ContentAllocationDirectory  `gorm:"foreignKey:ContentAllocId;references:Id;constraint:OnUpdate:SET NULL,OnDelete:SET NULL;"`
	ScheduleAllocationDirectory ScheduleAllocationDirectory `gorm:"foreignKey:ScheduleAllocId;references:Id;constraint:OnUpdate:SET NULL,OnDelete:SET NULL;"`
	DeviceRegistrationDirectory DeviceRegistrationDirectory `gorm:"foreignKey:RegistrationId;references:RegistrationId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
