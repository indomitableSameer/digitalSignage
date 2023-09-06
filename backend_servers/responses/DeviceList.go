package response

import (
	"time"

	"github.com/google/uuid"
)

type DeviceList struct {
	Id        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Mac       string
	Location  string
	CreatedAt time.Time
}
