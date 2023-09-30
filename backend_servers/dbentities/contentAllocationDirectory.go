package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type ContentAllocationDirectory struct {
	Id              uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	ContentInfoId   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	DeviceId        uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	CreatedAt       time.Time
	ContentInfo     ContentInfo     `gorm:"foreignKey:ContentInfoId;references:ContentId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	DeviceDirectory DeviceDirectory `gorm:"foreignKey:DeviceId;references:DeviceID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
