package dbentities

import (
	"time"

	"github.com/google/uuid"
)

type ContentAllocationDirectory struct {
	ContentId             uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	FileName              string    `gorm:"unique; not null"`
	Description           string
	ThumbnailDataBucketId uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	FileDataBacketId      uuid.UUID `gorm:"unique; not null;type:uuid;default:uuid_generate_v4()"`
	CreatedAt             time.Time
}
