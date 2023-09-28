package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type ContentInfo struct {
	ContentId            uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	FileName             string    `gorm:"unique; not null"`
	Description          string    `gorm:"not null"`
	FileBacketObjId      uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	ThumbnailBucketObjId uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	CreatedAt            time.Time
}
