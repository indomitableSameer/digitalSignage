package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceList struct {
	DeviceId  uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	Mac       string    `gorm:"unique; not null"`
	CreatedAt time.Time
}
