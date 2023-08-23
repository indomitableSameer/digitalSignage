package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceRegistration struct {
	RegistrationId uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	IpAddr         string
	Service        string
	CreatedAt      time.Time
	DeviceId       uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()"`
	DeviceList     DeviceList `gorm:"foreignKey:DeviceId;references:DeviceId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
