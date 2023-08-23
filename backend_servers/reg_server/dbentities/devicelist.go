package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceList struct {
	DeviceId  uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Mac       string
	CreatedAt time.Time
}
