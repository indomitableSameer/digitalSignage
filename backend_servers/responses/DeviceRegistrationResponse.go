package response

import "github.com/google/uuid"

type DeviceRegistrationResponse struct {
	RegistrationStatus int
	UniqueSystemId     uuid.UUID
	ServiceUrl         string
	ServicePort        string
	Timezone           string
}
