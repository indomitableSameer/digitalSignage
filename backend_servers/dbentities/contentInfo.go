package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type ContentInfo struct {
	ContentId uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	FileName  string    `gorm:"unique; not null"`
	CreatedAt time.Time
}
