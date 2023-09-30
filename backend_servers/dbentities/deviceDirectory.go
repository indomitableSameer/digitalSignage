package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type DeviceDirectory struct {
	DeviceID  uuid.UUID `gorm:"primary_key; unique; not null; type:uuid; default:uuid_generate_v4()"`
	MAC       string    `gorm:"unique; not null"`
	AreaId    uint64    `gorm:"not null"`
	CreatedAt time.Time
	Area      Area `gorm:"foreignKey:AreaId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
