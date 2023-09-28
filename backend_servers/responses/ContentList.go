package response

import "github.com/google/uuid"

type ContentList struct {
	Id          uuid.UUID
	Name        string
	Description string
	Date        string
	Time        string
}
