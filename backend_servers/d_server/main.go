package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var db, _ = gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ dss_reg_server"), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})

type StatusUpdateRequest struct {
	Id          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Mac         string
	App_Version string
	Os_Version  string
}

func status(w http.ResponseWriter, r *http.Request) {
	var statusReq StatusUpdateRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &statusReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println("received ", statusReq)
	var regDev dbentities.DeviceRegistration
	db.Where("Registration_Id = ?", statusReq.Id).First(&regDev)
	fmt.Println(regDev)
	if statusReq.Id != uuid.Nil && statusReq.Id == regDev.RegistrationId {
		fmt.Println("Found device id ", regDev.DeviceId)

		// add this to db and send response
		var status dbentities.DeviceStatus
		status.DeviceId = regDev.DeviceId
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

// func addDeviceToDB(db *gorm.DB, mac string, ipAddr string) error {

// 	if err := db.Create(&Device{Mac: mac, Ipaddr: ipAddr}).Error; err != nil {
// 		return err
// 	}

// 	return nil
// }

func main() {

	// db, err := gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ docs_simplecrud_gorm"), &gorm.Config{})
	// if err != nil {
	// 	log.Fatal(err)
	// }

	fmt.Println("creating db..")
	db.AutoMigrate(&dbentities.DeviceList{})
	db.AutoMigrate(&dbentities.DeviceStatus{})

	multiplexer := mux.NewRouter()
	multiplexer.HandleFunc("/status", status).Methods(http.MethodPut)
	servererror := http.ListenAndServe(":8000", multiplexer)
	if servererror != nil {
		fmt.Println(servererror)
	}
}
