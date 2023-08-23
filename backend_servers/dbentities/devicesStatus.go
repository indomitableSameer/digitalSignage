package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceStatus struct {
	DeviceId   uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeviceList DeviceList `gorm:"foreignKey:DeviceId;references:DeviceId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
