package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
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
	var device Device
	db.Where("Mac = ?", regReq.Mac).First(&device)
	fmt.Println(device)
	if regReq.Mac != device.Mac {
		fmt.Println("mac not found")

		// add this to db and send response
		var device Device
		device.Mac = regReq.Mac
		device.Id = uuid.New()
		device.Ipaddr = regReq.IpAddr
		device.Service = "device.dss.com"
		db.Create(&device)

		response := DeviceRegistrationResponse{Backend_Server_url: device.Service, RegistrationStatus: 1, UniqueSystemId: device.Id}
		json, _ := json.Marshal(response)
		w.Header().Set("content-type", "application/json")
		w.Write(json)
	} else {
		response := DeviceRegistrationResponse{Backend_Server_url: device.Service, RegistrationStatus: 2, UniqueSystemId: device.Id}
		json, _ := json.Marshal(response)
		w.Header().Set("content-type", "application/json")
		w.Write(json)
		//w.WriteHeader(http.StatusFound)
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

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/register", register).Methods(http.MethodPost)
	servererror := http.ListenAndServe(":8000", multiplexer)
	if servererror != nil {
		fmt.Println(servererror)
	}
}
