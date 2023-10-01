package requests

type StatusUpdateRequest struct {
	RegistrationId  string
	ScheduleAllocId string
	ContentAllocId  string
	App_Version     string
	Os_Version      string
	IpAddr          string
}
