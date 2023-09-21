package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceRegistrationDirectory struct {
	RegistrationId  uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	DeviceId        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4(); not null"`
	CountryId       uint      `gorm:"not null"`
	ServiceUrl      string
	ServicePort     string
	CreatedAt       time.Time
	Country         Country         `gorm:"foreignKey:CountryId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	DeviceDirectory DeviceDirectory `gorm:"foreignKey:DeviceId;references:DeviceID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
