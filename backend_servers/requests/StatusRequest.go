package requests

import (
	"github.com/google/uuid"
)

type StatusUpdateRequest struct {
	Id          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Mac         string
	App_Version string
	Os_Version  string
}
