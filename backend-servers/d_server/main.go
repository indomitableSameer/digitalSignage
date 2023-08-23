package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var db, _ = gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ dss_reg_server"), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})

// type DeviceDbInterface interface {
// 	AddDevice(device Device)
// 	GetRegisteredDevices() []Device
// }

// type DeviceDb struct {
// 	devices []Device
// }

// func (r *DeviceDb) AddDevice(d Device) {
// 	r.devices = append(r.devices, d)
// }

// func (r *DeviceDb) GetRegisteredDevices() []Device {
// 	return r.devices
// }

type Device struct {
	Id      uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Mac     string
	Ipaddr  string
	Service string
}

type StatusUpdateRequest struct {
	Id          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Mac         string
	App_Version string
	Os_Version  string
}

type Device_Status struct {
	//Id        int `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	DeviceId uuid.UUID `gorm:"unique;type:uuid;default:uuid_generate_v4()"`
	Device   Device    `gorm:"foreignKey:Id;references:DeviceId;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

// type Device_Details struct {
// 	DeviceId  uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
// 	CreatedAt time.Time
// 	UpdatedAt time.Time
// 	Device    Device `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
// }

func status(w http.ResponseWriter, r *http.Request) {
	var statusReq StatusUpdateRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &statusReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println("received {%s} ", statusReq)
	var device Device
	db.Where("Id = ?", statusReq.Id).First(&device)
	fmt.Println(device)
	if statusReq.Id == device.Id {
		fmt.Println("Found device id %s !", device.Id)

		// add this to db and send response
		var status Device_Status
		status.DeviceId = device.Id
		//status.last_update = time.Now()
		//db.Create(&status)
		db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "device_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"updated_at"}),
		}).Create(&status)
		return
	}
	w.WriteHeader(http.StatusForbidden)
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
	db.AutoMigrate(&Device_Status{})

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/status", status).Methods(http.MethodPut)
	servererror := http.ListenAndServe(":8000", multiplexer)
	if servererror != nil {
		fmt.Println(servererror)
	}
}
