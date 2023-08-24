package requests

import (
	"github.com/google/uuid"
)

type ContentRequest struct {
	Id       uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	fileInfo string
}
