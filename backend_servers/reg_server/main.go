package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db, _ = gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ dss_reg_server"), &gorm.Config{})

type DeviceDbInterface interface {
	AddDevice(device Device)
	GetRegisteredDevices() []Device
}

type DeviceDb struct {
	devices []Device
}

func (r *DeviceDb) AddDevice(d Device) {
	r.devices = append(r.devices, d)
}

func (r *DeviceDb) GetRegisteredDevices() []Device {
	return r.devices
}

type Device struct {
	Mac     string
	Ipaddr  string
	Service string
	Id      uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
}

type DeviceRegistrationRequest struct {
	Mac    string
	IpAddr string
}

type DeviceRegistrationResponse struct {
	RegistrationStatus int
	UniqueSystemId     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Backend_Server_url string
}

func register(w http.ResponseWriter, r *http.Request) {
	var regReq DeviceRegistrationRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &regReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println("going to check if mac present")
	var devicelist dbentities.DeviceList
	db.Where("Mac = ?", regReq.Mac).First(&devicelist)
	fmt.Println(devicelist)
	if regReq.Mac == devicelist.Mac {

		var registerdDevices dbentities.DeviceRegistration
		db.Where("Device_Id = ?", devicelist.DeviceId).First(&registerdDevices)
		fmt.Println(registerdDevices)
		if registerdDevices.DeviceId != uuid.Nil {

			response := DeviceRegistrationResponse{Backend_Server_url: registerdDevices.Service, RegistrationStatus: 2, UniqueSystemId: registerdDevices.RegistrationId}
			json, _ := json.Marshal(response)
			w.Header().Set("content-type", "application/json")
			w.Write(json)
			return
		}

		// add this to db and send response
		var register dbentities.DeviceRegistration
		register.DeviceId = devicelist.DeviceId
		register.RegistrationId = uuid.New()
		register.IpAddr = regReq.IpAddr
		register.Service = "device.dss.com"
		db.Create(&register)

		response := DeviceRegistrationResponse{Backend_Server_url: register.Service, RegistrationStatus: 1, UniqueSystemId: register.RegistrationId}
		json, _ := json.Marshal(response)
		w.Header().Set("content-type", "application/json")
		w.Write(json)
	} else {
		// response := DeviceRegistrationResponse{Backend_Server_url: devicelist.Service, RegistrationStatus: 2, UniqueSystemId: devicelist.}
		// json, _ := json.Marshal(response)
		// w.Header().Set("content-type", "application/json")
		// w.Write(json)
		w.WriteHeader(http.StatusPreconditionFailed)
	}
}

// func checkDbEntry(entity string, value string, )
// {
// 	db.Where(entity + " = ?", value).First(&user)
// }

func addDeviceToDB(db *gorm.DB, mac string, ipAddr string) error {

	if err := db.Create(&Device{Mac: mac, Ipaddr: ipAddr}).Error; err != nil {
		return err
	}

	return nil
}

func main() {

	// db, err := gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ docs_simplecrud_gorm"), &gorm.Config{})
	// if err != nil {
	// 	log.Fatal(err)
	// }

	fmt.Println("creating db..")
	db.AutoMigrate(&Device{})
	db.AutoMigrate(&dbentities.DeviceList{})
	db.AutoMigrate(&dbentities.DeviceRegistration{})

	db.Create(&dbentities.DeviceList{DeviceId: uuid.New(), Mac: "ab:ac:ad:ae:af"})

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/register", register).Methods(http.MethodPost)
	servererror := http.ListenAndServe(":8000", multiplexer)
	if servererror != nil {
		fmt.Println(servererror)
	}
}
