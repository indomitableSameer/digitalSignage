package response

type DeviceList struct {
	Mac        string
	Registered bool
	Online     bool
	Location   string
}
