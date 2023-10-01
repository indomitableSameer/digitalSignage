package response

type DeviceInfo struct {
	Mac             string
	IsRegistered    bool
	IsOnline        bool
	Area            string
	Building        string
	City            string
	Country         string
	StartDate       string
	EndDate         string
	StartTime       string
	EndTime         string
	ContentFileName string
	DeviceOS        string
	DeviceAppVer    string
	DeviceIp        string
	DevAddedOn      string
	DevRegOn        string
	LastUpdateAt    string
}
